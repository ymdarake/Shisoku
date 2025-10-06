import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InputDisplay } from '../../components/InputDisplay';

describe('InputDisplay', () => {
  it('should display the expression', () => {
    render(<InputDisplay expression="1 + 2" />);
    expect(screen.getByText('1 + 2')).toBeInTheDocument();
  });

  it('should display placeholder when expression is empty', () => {
    render(<InputDisplay expression="" />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('should display complex expression', () => {
    render(<InputDisplay expression="( 1 + 2 ) * 3" />);
    expect(screen.getByText('( 1 + 2 ) * 3')).toBeInTheDocument();
  });

  it('should have aria-live attribute for screen readers', () => {
    render(<InputDisplay expression="1 + 2" />);
    const display = screen.getByTestId('input-display');
    expect(display).toHaveAttribute('aria-live', 'polite');
  });

  it('should have role="status" for accessibility', () => {
    render(<InputDisplay expression="1 + 2" />);
    const display = screen.getByTestId('input-display');
    expect(display).toHaveAttribute('role', 'status');
  });

  it('should have aria-label for accessibility', () => {
    render(<InputDisplay expression="1 + 2" />);
    const display = screen.getByTestId('input-display');
    expect(display).toHaveAttribute('aria-label', '入力中の式');
  });
});
