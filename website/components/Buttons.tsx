import styled from 'styled-components';
import { BaseButton } from './BaseButton';

const PrimaryButton = styled(BaseButton)`
  width: 100%;
  height: 60px;
  background: #000000;
  outline: none;
  font-weight: bold;
  font-style: normal;
  font-family: 'Khula';
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  transition: all 0.15s ease-in;
  will-change: transform, background-color, box-shadow;
  cursor: pointer;
  :active {
    transform: scale(0.98);
  }
  :disabled {
    cursor: not-allowed;
    background: #fff;
    border: 1px solid black;
  }
  :hover {
    background-color: ${(props) => props.theme.palette.purple};
  }
  /* also focus ?? */
  :hover:not(:disabled) {
    transform: scale(0.98), translateY(-2px);
  }
`;

const SecondaryButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  text-decoration: none;
  background: #ffffff;
  box-shadow: inset 0px 4px 9px rgba(255, 255, 255, 0.25);
  border-radius: 11px;
  outline: none;
  font-weight: bold;
  font-style: normal;
  font-family: 'Khula';
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #333b4e;
  transition: all 0.15s ease-in;
  will-change: transform, background-color, box-shadow;
  cursor: pointer;
  :active {
    transform: scale(0.98);
  }
  :disabled {
    box-shadow: inset 0px 4px 9px rgba(255, 255, 255, 0.25);
    cursor: not-allowed;
  }
  :hover {
    color: ${(props) => props.theme.palette.purple};
  }
  :hover:not(:disabled) {
    transform: scale(0.98), translateY(-2px);
  }
`;

const GoldenPrimaryButton = styled(PrimaryButton)`
  background: #b58532;
`;

const PrimaryButtonLink = styled(PrimaryButton)`
  text-decoration: none;
  width: 162px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
`;

const GoldenPrimaryButtonLink = styled(PrimaryButtonLink)`
  background: #b58532;
`;

export {
  PrimaryButton,
  PrimaryButtonLink,
  SecondaryButton,
  GoldenPrimaryButton,
  GoldenPrimaryButtonLink,
};
