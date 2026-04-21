import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type BaseInputProps = TextFieldProps & {
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
};

export const BaseInput: React.FC<BaseInputProps> = ({ label, error = false, helperText, ...props }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
};

export default BaseInput;
