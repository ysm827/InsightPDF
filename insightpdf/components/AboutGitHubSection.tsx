import React, { useState } from 'react';
import { Github, Star } from 'lucide-react';

const GITHUB_REPO_URL = 'https://github.com/yeahhe365/InsightPDF';

const AboutGitHubSection: React.FC = () => {
  const [starCount, setStarCount] = useState<number | null>(null);

  React.useEffect(() => {
    fetch('https://api.github.com/repos/yeahhe365/InsightPDF')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok');
      })
      .then((data) => setStarCount(data.stargazers_count))
      .catch((error) => console.log('Failed to fetch GitHub stars:', error));
  }, []);

  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group decoration-0"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
          <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">InsightPDF 开源仓库</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">给项目点个 Star 支持一下</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
          {starCount !== null ? starCount.toLocaleString() : '...'}
        </span>
      </div>
    </a>
  );
};

export default AboutGitHubSection;
