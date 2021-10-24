import React from 'react';
import styled from 'styled-components';
import { P } from '../../components/Typography';
import { PrimaryButton } from '../../components/Buttons';
import { FormInput } from '../../components/Input'

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`;

const CheckoutForm = styled(FormInput)`
  ::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  }
  ::-webkit-outer-spin-button{
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
  ref: any,
}

const Checkout = (props: CheckoutProps) => {
  return (
    <Container>
      <P>Enter amount</P>
      <CheckoutForm 
        ref={props.ref} 
        type="number" 
      />
      <CheckoutInfoContainer>
        <CheckoutInfoItem>
          <P>USD Value:</P>
          <P>$1000</P>
        </CheckoutInfoItem>
        <CheckoutInfoItem>
          <P>Gas fee</P>
          <P>$0</P>
        </CheckoutInfoItem>
        <CheckoutInfoItem>
          <P>Expiration</P>
          <P>Nov 2022</P>
        </CheckoutInfoItem>
        <PrimaryButton>
          Confirm
        </PrimaryButton>
      </CheckoutInfoContainer>
    </Container>
  )
}

export default Checkout;