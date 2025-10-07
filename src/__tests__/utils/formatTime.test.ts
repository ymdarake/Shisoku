import { describe, it, expect } from 'vitest';
import { formatTime } from '../../utils/formatTime';

describe('formatTime', () => {
  it('0秒を "00:00" にフォーマットする', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('59秒以下を "00:ss" にフォーマットする', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(30)).toBe('00:30');
    expect(formatTime(59)).toBe('00:59');
  });

  it('1分以上を "mm:ss" にフォーマットする', () => {
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(83)).toBe('01:23');
    expect(formatTime(125)).toBe('02:05');
  });

  it('10分以上を正しくフォーマットする', () => {
    expect(formatTime(600)).toBe('10:00');
    expect(formatTime(725)).toBe('12:05');
    expect(formatTime(999)).toBe('16:39');
  });

  it('ゼロパディングが正しく機能する', () => {
    expect(formatTime(61)).toBe('01:01');
    expect(formatTime(605)).toBe('10:05');
  });
});
