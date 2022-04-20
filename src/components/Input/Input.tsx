import React from 'react';
import styled from 'styled-components';

export interface InputProps {
  endAdornment?: React.ReactNode;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  startAdornment?: React.ReactNode;
  value: string;
}

const Input: React.FC<InputProps> = ({ endAdornment, onChange, placeholder, startAdornment, value }) => {
  return (
    <StyledInputWrapper>
      {!!startAdornment && startAdornment}
      <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
      {!!endAdornment && endAdornment}
    </StyledInputWrapper>
  );
};

const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: #0A142A;
  border-radius: 20px;
  display: flex;
`;

const StyledInput = styled.input`
  background: none;
  border: 0;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0 20px;
  outline: none;
`;

export default Input;
