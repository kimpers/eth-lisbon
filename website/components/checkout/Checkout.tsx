import React, { useState } from 'react';
import styled from 'styled-components';
import { H4, P } from '../../components/Typography';
import { PrimaryButton } from '../../components/Buttons';
import { FormInput } from '../../components/Input';
import { COLLATERAL_TOKEN_SYMBOL } from '../../utils/config';
import { SuccessIcon } from '../../components/icons/SuccessIcon';
import {} from '../../hooks/useSPUNK';

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
  ref: any;
  position: string;
}

const Checkout = (props: CheckoutProps) => {
  const [succeeded, setSucceeded] = useState(false);

  // TODO: Integrate smart contract call
  const onConfirm = () => {
    setSucceeded(true);
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
            <CheckoutForm ref={props.ref} type="number" />
            <span style={{ marginLeft: '-50px', fontWeight: 700, zIndex: 999 }}>
              {COLLATERAL_TOKEN_SYMBOL}
            </span>
          </div>
          <CheckoutInfoContainer>
            <CheckoutInfoItem>
              <P>USD Value:</P>
              <P>$1000</P>
            </CheckoutInfoItem>
            {/* <CheckoutInfoItem>
                <P>Gas fee</P>
                <P>$0</P>
              </CheckoutInfoItem> */}
            <CheckoutInfoItem>
              <P>Expiration</P>
              <P>Nov 2022 (Punk anniversary) </P>
            </CheckoutInfoItem>
            <div style={{ paddingBottom: '10px' }} />
            <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
          </CheckoutInfoContainer>
        </>
      ) : (
        <SuccessContainer>
          <SuccessIcon />
          <P>
            You’re {props.position === 'long' ? 'LONG on' : 'SHORTING'} on
            Cryptopunks for {props.ref?.current?.value} DAI. Congrats and let’s
            go!
          </P>
        </SuccessContainer>
      )}
    </Container>
  );
};

export default Checkout;
