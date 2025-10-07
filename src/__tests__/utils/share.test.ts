import { describe, it, expect } from 'vitest';
import { generateShareText, shareToTwitter } from '../../utils/share';

describe('generateShareText', () => {
  it('should generate share text with score, time, and total questions', () => {
    const text = generateShareText({
      score: 8,
      time: 125, // 2分5秒
      totalQuestions: 10,
    });

    expect(text).toContain('8');
    expect(text).toContain('10');
    expect(text).toContain('02:05'); // ゼロパディング
  });

  it('should format time with zero padding for minutes', () => {
    const text = generateShareText({
      score: 5,
      time: 35, // 0分35秒
      totalQuestions: 10,
    });

    expect(text).toContain('00:35');
  });

  it('should format time with zero padding for seconds', () => {
    const text = generateShareText({
      score: 7,
      time: 65, // 1分5秒
      totalQuestions: 10,
    });

    expect(text).toContain('01:05');
  });

  it('should include hashtag', () => {
    const text = generateShareText({
      score: 10,
      time: 100,
      totalQuestions: 10,
    });

    expect(text).toContain('#四則');
  });

  it('should handle perfect score', () => {
    const text = generateShareText({
      score: 10,
      time: 90,
      totalQuestions: 10,
    });

    expect(text).toContain('10');
    expect(text).toContain('10');
  });

  it('should handle zero score', () => {
    const text = generateShareText({
      score: 0,
      time: 200,
      totalQuestions: 10,
    });

    expect(text).toContain('0');
  });
});

describe('shareToTwitter', () => {
  it('should generate correct Twitter Web Intent URL', () => {
    const url = shareToTwitter({
      score: 8,
      time: 125,
      totalQuestions: 10,
    });

    expect(url).toContain('https://twitter.com/intent/tweet');
    expect(url).toContain('text=');
  });

  it('should URL encode the share text', () => {
    const url = shareToTwitter({
      score: 8,
      time: 125,
      totalQuestions: 10,
    });

    // スペースや特殊文字がエンコードされている
    expect(url).toContain('%');
  });

  it('should include all required parameters', () => {
    const url = shareToTwitter({
      score: 9,
      time: 80,
      totalQuestions: 10,
    });

    const shareText = generateShareText({
      score: 9,
      time: 80,
      totalQuestions: 10,
    });
    const encodedText = encodeURIComponent(shareText);

    expect(url).toBe(`https://twitter.com/intent/tweet?text=${encodedText}`);
  });
});
