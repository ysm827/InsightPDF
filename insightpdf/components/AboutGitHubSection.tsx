import React, { useState } from 'react';
import { Github, Star, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

const AboutGitHubSection: React.FC = () => {
  const [starCount, setStarCount] = useState<number | null>(null);

  React.useEffect(() => {
    fetch(APP_CONFIG.GITHUB_API_URL)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok');
      })
      .then((data) => setStarCount(data.stargazers_count))
      .catch((error) => console.log('Failed to fetch GitHub stars:', error));
  }, []);

  return (
    <a
      href={APP_CONFIG.GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50 to-gray-100/60 dark:from-gray-800/80 dark:to-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xs transition-all group decoration-0 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-2xs group-hover:scale-105 transition-transform text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-800">
          <Github className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100">
              InsightPDF 开源仓库
            </span>
            <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            欢迎在 GitHub 上 Star 支持项目
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xs">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-xs font-bold font-mono text-gray-700 dark:text-gray-200">
          {starCount !== null ? starCount.toLocaleString() : '...'}
        </span>
      </div>
    </a>
  );
};

export default AboutGitHubSection;

