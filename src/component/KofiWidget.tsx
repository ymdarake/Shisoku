import React from 'react';

interface KofiWidgetProps {
  kofiUrl?: string; // Ko-fi URL（例: "https://ko-fi.com/yourname"）未設定なら「coming soon」表示
}

export const KofiWidget: React.FC<KofiWidgetProps> = ({ kofiUrl }) => {
  // Ko-fi URL未設定の場合は「coming soon」表示
  if (!kofiUrl) {
    return (
      <div className="flex justify-center mb-6">
        <div className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold rounded-lg shadow-lg border-2 border-orange-500">
          <div className="flex items-center space-x-2">
            <span className="text-2xl" aria-hidden="true">☕</span>
            <span>Ko-fi coming soon</span>
          </div>
        </div>
      </div>
    );
  }

  // Ko-fi URL設定済みの場合はリンク付きボタン
  return (
    <div className="flex justify-center mb-6">
      <a
        href={kofiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold rounded-lg shadow-lg border-2 border-orange-500 hover:from-orange-500 hover:to-red-500 transition"
        aria-label="Support me on Ko-fi"
      >
        <span className="text-2xl" aria-hidden="true">☕</span>
        <span>Support me on Ko-fi</span>
      </a>
    </div>
  );
};
