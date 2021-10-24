import styled, { css } from 'styled-components';

export interface InputProps {
  hasError?: boolean;
  surroundingBgColor?: 'light' | 'dark';
  disabled?: boolean;
}

const baseInputStyle = css<InputProps>`
  background: ${(props) =>
    props.surroundingBgColor === 'dark'
      ? props.theme.palette.black
      : props.theme.palette.white};
  border: 1px solid
    ${(props) =>
      props.hasError ? props.theme.palette.errorRed : 'transparent'};
  box-shadow: ${(props) =>
    props.surroundingBgColor === 'dark'
      ? `0px 2px 2px 0px ${props.theme.colors.primaryText} 7% inset, 0px -1px 1px 0px ${props.theme.colors.primaryText} 20%`
      : `0px 2px 2px 0px ${props.theme.colors.primaryText} 7% inset, 0px -1px 1px 0px ${props.theme.colors.primaryText} 20%`};
  box-sizing: border-box;
  color: ${(props) => props.theme.colors.primaryText};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
  font-family: 'Gilroy', sans-serif;
  font-size: 24px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  height: 60px;
  line-height: 28px;
  outline: none;
  padding-left: 15px;
  padding-right: 2px;
  transition: border, 0.15s ease-in, box-shadow, 0.15s ease-out;
  width: 100%;
  will-change: border, box-shadow, opacity;
  border: 1px solid
    ${(props) =>
      props.hasError
        ? props.theme.palette.errorRed
        : props.theme.palette.black};
  :hover {
    cursor: text;
    box-shadow: ${(props) =>
      props.surroundingBgColor === 'dark'
        ? `inset 0px 2px 2px rgba(4, 8, 106, 0.07)`
        : `inset 0px 2px 2px rgba(4, 8, 106, 0.07)`};
  }
  :focus {
    border: 1px solid
      ${(props) =>
        props.hasError
          ? props.theme.palette.errorRed
          : props.theme.palette.black};
    box-shadow: ${(props) =>
      props.surroundingBgColor === 'dark'
        ? `0px 2px 2px 0px ${props.theme.colors.primaryText} 7% inset, 0px -1px 1px 0px ${props.theme.colors.primaryText} 20%`
        : `0px 2px 2px 0px ${props.theme.colors.primaryText} 7% inset, 0px -1px 1px 0px ${props.theme.colors.primaryText} 20%`};
  }
  ::placeholder {
    color: ${(props) => props.theme.colors.primaryText};
    opacity: 0.6;
  }
`;

const StyledInput = styled.input<InputProps>`
  ${baseInputStyle}
`;

const FormInput = styled(StyledInput)`
  font-size: 16px;
  height: 52px;
`;

export { StyledInput as Input, FormInput };