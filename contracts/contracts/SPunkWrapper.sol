//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

enum Direction {
    Long,
    Short
}

interface IWrappedNativeToken {
    function deposit() external payable;
    function withdraw(uint wad) external;
    function approve(address guy, uint wad) external returns (bool);
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function allowance(address guy) external returns (uint);
    function balanceOf(address guy) external returns (uint);
}

interface IERC20 {
    function approve(address guy, uint wad) external returns (bool);
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function allowance(address guy) external returns (uint);
    function balanceOf(address guy) external returns (uint);
}

interface IBalancerV2Vault {
    enum SwapKind { GIVEN_IN, GIVEN_OUT }
    /**
     * @dev Performs a swap with a single Pool.
     *
     * If the swap is given in (the number of tokens to send to the Pool is known), returns the amount of tokens
     * taken from the Pool, which must be greater than or equal to `limit`.
     *
     * If the swap is given out (the number of tokens to take from the Pool is known), returns the amount of
     * tokens sent to the Pool, which must be less than or equal to `limit`.
     *
     * Internal Balance usage and the recipient are determined by the `funds` struct.
     *
     * Emits a `Swap` event.
     * For full documentation see https://github.com/balancer-labs/balancer-core-v2/blob/master/contracts/vault/interfaces/IVault.sol
     */
    function swap(
        SingleSwap calldata request,
        FundManagement calldata funds,
        uint256 limit,
        uint256 deadline
    ) external payable returns (uint256);

    struct SingleSwap {
        bytes32 poolId;
        SwapKind kind;
        IERC20 assetIn;
        IERC20 assetOut;
        uint256 amount;
        bytes userData;
    }

    struct FundManagement {
        address sender;
        bool fromInternalBalance;
        address payable recipient;
        bool toInternalBalance;
    }
}

// See https://github.com/UMAprotocol/protocol/blob/master/packages/core/contracts/financial-templates/long-short-pair/LongShortPair.sol
interface ILongShortPairContract {
    /**
     * @notice Creates a pair of long and short tokens equal in number to tokensToCreate. Pulls the required collateral
     * amount into this contract, defined by the collateralPerPair value.
     * @dev The caller must approve this contract to transfer `tokensToCreate * collateralPerPair` amount of collateral.
     * @param tokensToCreate number of long and short synthetic tokens to create.
     * @return collateralUsed total collateral used to mint the synthetics.
     */
    function create(uint256 tokensToCreate) external returns (uint256 collateralUsed);
}

contract SPunkWrapper {
    IWrappedNativeToken private immutable wrappedNativeToken;
    ILongShortPairContract private immutable longShortPairContract;
    uint256 private constant MAX_AMOUNT = type(uint256).max;

    IERC20 public immutable longPunkToken;
    IERC20 public immutable shortPunkToken;

    constructor(ILongShortPairContract _longShortPairContract, IWrappedNativeToken _wrappedNativeToken,IERC20 _longPunkToken, IERC20 _shortPunkToken) {
        longShortPairContract = _longShortPairContract;
        wrappedNativeToken = _wrappedNativeToken;
        longPunkToken = _longPunkToken;
        shortPunkToken = _shortPunkToken;
    }

    function _approveIfBelow(
        IERC20 token,
        address spender,
        uint256 amount
    )
        private
    {
        if (token.allowance(spender) < amount) {
            token.approve(spender, MAX_AMOUNT - 1);
        }
    }

    function mintAndSell(Direction direction, IBalancerV2Vault vault, bytes32 poolId)
        public
        payable
    {
        uint amount = msg.value;
        address payable sender = payable(msg.sender);

        require(amount > 0, "SPUNK/VALUE_GREATER_THAN_ZERO");
        wrappedNativeToken.deposit{value: amount}();

        // NOTE: for MVP we do 1:1 ratio between amount of MATIC and long/short tokens
        _approveIfBelow(IERC20(address(wrappedNativeToken)), address(longShortPairContract), amount);
        longShortPairContract.create(amount);


        IERC20 assetIn;
        IERC20 assetOut;
        if (direction == Direction.Short) {
            assetIn = longPunkToken;
            assetOut = shortPunkToken;
        } else {
            assetIn = shortPunkToken;
            assetOut = longPunkToken;
        }

        _approveIfBelow(assetIn, address(vault), amount);
        IBalancerV2Vault.SingleSwap memory request= IBalancerV2Vault.SingleSwap({
            poolId: poolId,
            kind: IBalancerV2Vault.SwapKind.GIVEN_IN,
            assetIn: assetIn,
            assetOut: assetOut,
            amount: amount,
            userData: ""
        });

        IBalancerV2Vault.FundManagement memory funds = IBalancerV2Vault.FundManagement({
            sender: address(this),
            fromInternalBalance: false,
            recipient: payable(address(this)),
            toInternalBalance: false
        });

        uint boughtAmount = vault.swap(
            request,
            funds,
            1, // min amount out
            block.timestamp // expires after this block
        );

        require(boughtAmount > 0, "SPUNK/BOUGHT_MORE_THAN_ZERO");
        require(assetOut.transferFrom(address(this), sender, boughtAmount), "SPUNK/TRANSFER_BOUGHT_AMT");
    }
}
