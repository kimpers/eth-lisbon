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

contract SPunkWrapper {
    IWrappedNativeToken private immutable wrappedNativeToken;
    IERC20 public immutable longPunkToken;
    IERC20 public immutable shortPunkToken;

    constructor(IWrappedNativeToken _wrappedNativeToken,IERC20 _longPunkToken, IERC20 _shortPunkToken) {
        wrappedNativeToken = _wrappedNativeToken;
        longPunkToken = _longPunkToken;
        shortPunkToken = _shortPunkToken;
    }

    function mintAndSell(Direction direction, IBalancerV2Vault vault, bytes32 poolId)
        public
        payable
    {
        uint amount = msg.value;
        address payable sender = payable(msg.sender);

        require(amount > 0, "SPUNK//VALUE_GREATER_THAN_ZERO");
        wrappedNativeToken.deposit{value: amount}();

        // TODO mint tokens

        IERC20 assetIn;
        IERC20 assetOut;
        if (direction == Direction.Short) {
            // TODO APPROVAL
            assetIn = longPunkToken;
            assetOut = shortPunkToken;

        } else {
            // TODO APPROVAL
            assetIn = shortPunkToken;
            assetOut = longPunkToken;
        }

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

        require(boughtAmount > 0, "SPUNK//BOUGHT_MORE_THAN_ZERO");
        // TODO: should this be transferFrom??
        require(assetOut.transfer(sender, boughtAmount), "SPUNK//TRANSFER_BOUGHT_AMT");
    }
}
