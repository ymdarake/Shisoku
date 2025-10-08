import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Controls } from '../../component/Controls';

describe('Controls', () => {
  const mockOnNumberClick = vi.fn();
  const mockOnOperatorClick = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnBackspace = vi.fn();

  const defaultProps = {
    numbers: [1, 2, 3, 4],
    usedNumberIndices: [],
    onNumberClick: mockOnNumberClick,
    onOperatorClick: mockOnOperatorClick,
    onClear: mockOnClear,
    onBackspace: mockOnBackspace,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all number buttons', () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
  });

  it('should render all operator buttons', () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '*' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '/' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '(' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ')' })).toBeInTheDocument();
  });

  it('should render clear and backspace buttons', () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    // Backspace button has an icon, check by testid or class
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(10); // 4 numbers + 6 operators + C + backspace
  });

  it('should call onNumberClick when number button is clicked', async () => {
    render(<Controls {...defaultProps} />);

    const button = screen.getByRole('button', { name: '1' });
    await userEvent.click(button);

    expect(mockOnNumberClick).toHaveBeenCalledWith(1, 0);
  });

  it('should call onOperatorClick when operator button is clicked', async () => {
    render(<Controls {...defaultProps} />);

    const button = screen.getByRole('button', { name: '+' });
    await userEvent.click(button);

    expect(mockOnOperatorClick).toHaveBeenCalledWith('+');
  });

  it('should call onClear when clear button is clicked', async () => {
    render(<Controls {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'C' });
    await userEvent.click(button);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should disable used number buttons', () => {
    render(<Controls {...defaultProps} usedNumberIndices={[0, 2]} />);

    const button1 = screen.getByRole('button', { name: '1' });
    const button2 = screen.getByRole('button', { name: '2' });
    const button3 = screen.getByRole('button', { name: '3' });
    const button4 = screen.getByRole('button', { name: '4' });

    expect(button1).toBeDisabled(); // index 0
    expect(button2).not.toBeDisabled(); // index 1
    expect(button3).toBeDisabled(); // index 2
    expect(button4).not.toBeDisabled(); // index 3
  });

  it('should not call onNumberClick when disabled button is clicked', async () => {
    render(<Controls {...defaultProps} usedNumberIndices={[0]} />);

    const button = screen.getByRole('button', { name: '1' });
    await userEvent.click(button);

    expect(mockOnNumberClick).not.toHaveBeenCalled();
  });
});
