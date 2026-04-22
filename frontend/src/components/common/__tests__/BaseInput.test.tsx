import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseInput } from '../BaseInput';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    TextField: ({ label, error, helperText, variant, fullWidth, ...props }: any) => (
      <label>
        {label}
        <input
          aria-label={label}
          data-error={error ? 'true' : 'false'}
          data-helper={helperText || ''}
          data-variant={variant || ''}
          data-full-width={fullWidth ? 'true' : 'false'}
          {...props}
        />
      </label>
    ),
  };
});

describe('BaseInput', () => {
  it('passes the expected props to the underlying text field', () => {
    render(
      <BaseInput
        label="Email"
        type="email"
        value="a@b.com"
        onChange={jest.fn()}
        error
        helperText="Mensagem de apoio"
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('value', 'a@b.com');
    expect(input).toHaveAttribute('data-error', 'true');
    expect(input).toHaveAttribute('data-helper', 'Mensagem de apoio');
    expect(input).toHaveAttribute('data-variant', 'outlined');
    expect(input).toHaveAttribute('data-full-width', 'true');
  });
});