import React, { useEffect, useState, useRef } from 'react';
import Decimal from 'decimal.js-light';
import Link from 'next/link';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { H4, P } from '../../components/Typography';
import { PrimaryButton } from '../../components/Buttons';
import { FormInput } from '../../components/Input';
import { ThickSpinnerIcon } from '../../components/icons/Spinner';
import { COLLATERAL_TOKEN_SYMBOL } from '../../utils/config';
import { SuccessIcon } from '../../components/icons/SuccessIcon';
import { routes } from '../../utils/routes';
import { useAllowance } from '../../hooks/useAllowance';
import { useSPUNK, Direction } from '../../hooks/useSPUNK';

const MAX_ALLOWANCE = new Decimal(2).pow(256).minus(1);

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 500px;
`;

const SuccessContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CheckoutForm = styled(FormInput)`
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CheckoutInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CheckoutInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface CheckoutProps {
  position: string;
}

const Checkout = (props: CheckoutProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isTxInProgress, setIsTxInProgress] = useState<boolean>(false);
  const [amountInBaseUnits, setAmountInBaseUnits] = useState<
    Decimal | undefined
  >(undefined);
  const [succeeded, setSucceeded] = useState(false);
  const { account, library } = useWeb3React();
  const { allowance, approve } = useAllowance(library, account);
  const spunk = useSPUNK(library, account);
  const doesNeedApproval =
    amountInBaseUnits && allowance.lessThan(amountInBaseUnits);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef?.current?.value) {
      const inputAmount = inputRef?.current?.value;
      setAmount(inputAmount);
    }
  }, [inputRef?.current?.value]);

  useEffect(() => {
    if (!amount) {
      return;
    }

    // TODO: don't hardcode this
    const _amountBaseUnits = new Decimal(amount).times(1e18);
    setAmountInBaseUnits(_amountBaseUnits);
  }, [amount, setAmountInBaseUnits]);

  const onConfirm = async () => {
    if (!amountInBaseUnits) {
      return;
    }
    const direction =
      props.position == 'long' ? Direction.Long : Direction.Short;

    setIsTxInProgress(true);
    try {
      await spunk.mintAndSell(direction, amountInBaseUnits);
      setSucceeded(true);
    } catch (err) {
      console.error(err);
    }
    setIsTxInProgress(false);
  };

  return (
    <Container>
      {!succeeded ? (
        <>
          <H4>
            {props.position === 'long' ? 'Long punks 🌝' : 'Short punks 🌚'}
          </H4>
          <P>Enter amount</P>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <CheckoutForm
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span style={{ marginLeft: '-50px', fontWeight: 700, zIndex: 999 }}>
              {COLLATERAL_TOKEN_SYMBOL}
            </span>
          </div>
          <CheckoutInfoContainer>
            {/* <CheckoutInfoItem>
              <P>USD Value:</P>
              <P>$1000</P>
            </CheckoutInfoItem> */}
            {/* <CheckoutInfoItem>
                <P>Gas fee</P>
                <P>$0</P>
              </CheckoutInfoItem> */}
            <CheckoutInfoItem>
              <P>Expiration</P>
              <P>June 2022 (Punk anniversary) </P>
            </CheckoutInfoItem>
            <div style={{ paddingBottom: '10px' }} />
            {!account && (
              <Link passHref href={routes.LOGIN}>
                <PrimaryButton style={{ maxWidth: '300px' }}>
                  Connect Wallet
                </PrimaryButton>
              </Link>
            )}
            {account && doesNeedApproval && (
              <PrimaryButton
                disabled={isTxInProgress}
                onClick={async () => {
                  setIsTxInProgress(true);
                  try {
                    await approve(amountInBaseUnits ?? MAX_ALLOWANCE);
                  } catch (err) {
                    console.error(err);
                  }
                  setIsTxInProgress(false);
                }}
              >
                {isTxInProgress ? <ThickSpinnerIcon /> : <span>Approve</span>}
              </PrimaryButton>
            )}
            {account && !doesNeedApproval && (
              <PrimaryButton disabled={isTxInProgress} onClick={onConfirm}>
                {isTxInProgress ? <ThickSpinnerIcon /> : <span>Confirm</span>}
              </PrimaryButton>
            )}
          </CheckoutInfoContainer>
        </>
      ) : (
        <SuccessContainer>
          <SuccessIcon />
          <P>
            You’re {props.position === 'long' ? 'LONG on' : 'SHORTING'} on
            Cryptopunks for {amount} DAI. Congrats and let’s go!
          </P>
        </SuccessContainer>
      )}
    </Container>
  );
};

export default Checkout;
