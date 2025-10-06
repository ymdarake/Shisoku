import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProblemDisplay } from '../../components/ProblemDisplay';

describe('ProblemDisplay', () => {
  const mockLocale = {
    numbersToUse: '数字',
    targetNumber: '目標',
  };

  it('should render all four numbers', () => {
    const problem = { numbers: [1, 2, 3, 4], target: 6 };
    render(<ProblemDisplay problem={problem} locale={mockLocale} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should render the target number', () => {
    const problem = { numbers: [5, 6, 7, 8], target: 9 };
    render(<ProblemDisplay problem={problem} locale={mockLocale} />);

    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('should display numbers with zero', () => {
    const problem = { numbers: [0, 1, 2, 3], target: 0 };
    render(<ProblemDisplay problem={problem} locale={mockLocale} />);

    // Should display at least one '0' from numbers array
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });

  it('should render locale labels', () => {
    const problem = { numbers: [1, 2, 3, 4], target: 5 };
    render(<ProblemDisplay problem={problem} locale={mockLocale} />);

    expect(screen.getByText('数字')).toBeInTheDocument();
    expect(screen.getByText('目標')).toBeInTheDocument();
  });
});
