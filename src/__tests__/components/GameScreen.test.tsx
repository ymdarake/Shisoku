import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { GameScreen } from '../../components/GameScreen';
import { ANSWER_JUDGMENT_DELAY_MS } from '../../constants/game';

describe('GameScreen - keyboard number input (Phase 1 - Red)', () => {
  const baseProps = {
    problem: { numbers: [1, 2, 3, 4], target: 6 },
    onCorrect: vi.fn(),
    onIncorrect: vi.fn(),
    onSkip: vi.fn(),
    onQuit: vi.fn(),
    locale: {
      buildExpression: '式を作ってください',
      correct: '正解！',
      incorrect: '不正解',
      question: '問題',
      skip: 'スキップ',
      backToTop: 'トップに戻る',
      confirmQuit: 'プレイを中断してトップに戻りますか？',
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

  it('pressing ( key should input opening parenthesis', async () => {
    render(<GameScreen {...baseProps} />);

    // userEvent sends the actual character '(' when Shift+9 is pressed
    await userEvent.keyboard('(');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('(');
  });

  it('pressing ) key should input closing parenthesis after a number', async () => {
    render(<GameScreen {...baseProps} />);

    // Build expression with opening parenthesis first: ( 1 + 2 )
    await userEvent.keyboard('(');
    await userEvent.keyboard('1');
    await userEvent.keyboard('+');
    await userEvent.keyboard('2');
    // userEvent sends the actual character ')' when Shift+0 is pressed
    await userEvent.keyboard(')');

    const display = screen.getByTestId('input-display');
    expect(display).toHaveTextContent('( 1 + 2 )');
  });
});

describe('GameScreen - special keys (Phase 3 - Red)', () => {
  const baseProps = {
    problem: { numbers: [1, 2, 3, 4], target: 6 },
    onCorrect: vi.fn(),
    onIncorrect: vi.fn(),
    onSkip: vi.fn(),
    onQuit: vi.fn(),
    locale: {
      buildExpression: '式を作ってください',
      correct: '正解！',
      incorrect: '不正解',
      question: '問題',
      skip: 'スキップ',
      backToTop: 'トップに戻る',
      confirmQuit: 'プレイを中断してトップに戻りますか？',
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

    // Wait for the ANSWER_JUDGMENT_DELAY_MS + buffer
    await new Promise(resolve => setTimeout(resolve, ANSWER_JUDGMENT_DELAY_MS + 100));

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

describe('GameScreen - accessibility (Phase 4)', () => {
  const baseProps = {
    problem: { numbers: [1, 2, 3, 4], target: 6 },
    onCorrect: vi.fn(),
    onIncorrect: vi.fn(),
    onSkip: vi.fn(),
    onQuit: vi.fn(),
    locale: {
      buildExpression: '式を作ってください',
      correct: '正解！',
      incorrect: '不正解',
      question: '問題',
      skip: 'スキップ',
      backToTop: 'トップに戻る',
      confirmQuit: 'プレイを中断してトップに戻りますか？',
    },
    questionNumber: 1,
    totalQuestions: 10,
    elapsedTime: 0,
    onPlayClickSound: vi.fn(),
    onPlayCorrectSound: vi.fn(),
    onPlayIncorrectSound: vi.fn(),
    onInvalidAction: vi.fn(),
  } as const;

  it('should have main game area with proper ARIA role', () => {
    render(<GameScreen {...baseProps} />);

    const mainArea = screen.getByRole('main');
    expect(mainArea).toBeInTheDocument();
  });

  it('should have input display with aria-live for screen readers', () => {
    render(<GameScreen {...baseProps} />);

    const display = screen.getByTestId('input-display');
    expect(display).toHaveAttribute('aria-live', 'polite');
  });

  it('should have skip button accessible via keyboard', () => {
    render(<GameScreen {...baseProps} />);

    const skipButton = screen.getByRole('button', { name: /スキップ/i });
    expect(skipButton).toBeInTheDocument();
  });

  it('should show quit button to go back to top and call onQuit on click', async () => {
    render(<GameScreen {...baseProps} />);

    const quitButton = screen.getByRole('button', { name: /トップに戻る/i });
    expect(quitButton).toBeInTheDocument();

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    await userEvent.click(quitButton);
    expect(confirmSpy).toHaveBeenCalledWith(baseProps.locale.confirmQuit);
    expect(baseProps.onQuit).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});


