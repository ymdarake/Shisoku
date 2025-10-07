/**
 * 秒数を mm:ss 形式の時間文字列に変換する
 * @param totalSeconds - 変換する秒数
 * @returns "mm:ss" 形式の文字列（例: "01:23", "12:05"）
 * @example
 * formatTime(83) // => "01:23"
 * formatTime(725) // => "12:05"
 */
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
