interface ShareData {
  score: number;
  time: number; // 秒数
  totalQuestions: number;
}

/**
 * 時間を MM:SS 形式にフォーマット（ゼロパディング）
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * スコア共有用のテキストを生成
 */
export const generateShareText = (data: ShareData): string => {
  const { score, time, totalQuestions } = data;
  const formattedTime = formatTime(time);

  return `四則パズルで ${score}/${totalQuestions} 問正解！
タイム: ${formattedTime}

#四則 #数学パズル`;
};

/**
 * Twitter/X Web Intent URL を生成
 */
export const shareToTwitter = (data: ShareData): string => {
  const text = generateShareText(data);
  const encodedText = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${encodedText}`;
};

/**
 * Twitter/X でスコアを共有（新規タブで開く）
 */
export const openTwitterShare = (data: ShareData): void => {
  const url = shareToTwitter(data);
  window.open(url, '_blank', 'noopener,noreferrer');
};
