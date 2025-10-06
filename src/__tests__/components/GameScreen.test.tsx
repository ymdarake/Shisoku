import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('GameScreen - special keys (Phase 3 - Red)', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pressing Backspace should delete the last token from expression', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    await userEvent.keyboard('+');
    await userEvent.keyboard('2');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('1 + 2');

    await userEvent.keyboard('{Backspace}');
    expect(display).toHaveTextContent('1 +');
  });

  it('pressing Enter should trigger check answer when all numbers are used', async () => {
    render(<GameScreen {...baseProps} />);

    // Build expression: 4 * 3 / 2 / 1 = 6 (correct answer, using all 4 numbers)
    // problem.numbers = [1, 2, 3, 4], target = 6
    await userEvent.keyboard('4');
    await userEvent.keyboard('*');
    await userEvent.keyboard('3');
    await userEvent.keyboard('/');
    await userEvent.keyboard('2');
    await userEvent.keyboard('/');
    await userEvent.keyboard('1');

    expect(baseProps.onCorrect).not.toHaveBeenCalled();

    await userEvent.keyboard('{Enter}');

    // Wait for the setTimeout (2000ms) in checkAnswer
    await new Promise(resolve => setTimeout(resolve, 2100));

    // onCorrect should be called because 4 * 3 / 2 / 1 = 6
    expect(baseProps.onCorrect).toHaveBeenCalled();
  });

  it('pressing Enter when not all numbers are used should do nothing', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    await userEvent.keyboard('+');
    await userEvent.keyboard('2');

    await userEvent.keyboard('{Enter}');
    // onCorrect/onIncorrect should not be called (only 2 numbers used out of 4)
    expect(baseProps.onCorrect).not.toHaveBeenCalled();
    expect(baseProps.onIncorrect).not.toHaveBeenCalled();
  });

  it('pressing Escape should clear the entire expression', async () => {
    render(<GameScreen {...baseProps} />);

    await userEvent.keyboard('1');
    await userEvent.keyboard('+');
    await userEvent.keyboard('2');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('1 + 2');

    await userEvent.keyboard('{Escape}');
    // After clear, InputDisplay shows placeholder "..." (not expression text)
    expect(display).not.toHaveTextContent('1');
    expect(display).not.toHaveTextContent('2');
    expect(display).not.toHaveTextContent('+');
  });
});


