import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { GameScreen } from '../../components/GameScreen';

describe('GameScreen - keyboard number input (Phase 1 - Red)', () => {
  const baseProps = {
    problem: { numbers: [1, 2, 3, 4], target: 6 },
    onCorrect: vi.fn(),
    onIncorrect: vi.fn(),
    onSkip: vi.fn(),
    locale: {
      buildExpression: '式を作ってください',
      correct: '正解！',
      incorrect: '不正解',
      question: '問題',
      skip: 'スキップ',
    },
    questionNumber: 1,
    totalQuestions: 10,
    elapsedTime: 0,
    onPlayClickSound: vi.fn(),
    onPlayCorrectSound: vi.fn(),
    onPlayIncorrectSound: vi.fn(),
    onInvalidAction: vi.fn(),
  } as const;

  it('pressing key "1" should input number 1 into expression (expected to fail before implementation)', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('1');
  });

  it('pressing the same number twice should not add a used number again', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    await userEvent.keyboard('1');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent(/^1$/);

    // The corresponding number button for 1 should be disabled
    const oneButton = screen.getByRole('button', { name: '1' });
    expect(oneButton).toBeDisabled();
  });

  it('pressing operator + after a number should append operator to expression', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    await userEvent.keyboard('+');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('1 +');
  });

  it('pressing * should input * operator after a number', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('2');
    await userEvent.keyboard('*');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('2 *');
  });
});


