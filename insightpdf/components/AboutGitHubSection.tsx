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
      className="flex items-center justify-between p-3.5 bg-[var(--theme-bg-secondary)]/40 rounded-xl border border-[var(--theme-border-secondary)]/60 hover:border-[var(--theme-border-focus)] hover:bg-[var(--theme-bg-tertiary)]/30 transition-all group decoration-0 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--theme-bg-primary)] rounded-lg shadow-2xs group-hover:scale-105 transition-transform text-[var(--theme-text-primary)] border border-[var(--theme-border-primary)]">
          <Github className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-bold text-[var(--theme-text-primary)]">
              InsightPDF 开源仓库
            </span>
            <ExternalLink className="w-3 h-3 text-[var(--theme-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-[var(--theme-text-secondary)]">
            欢迎在 GitHub 上 Star 支持项目
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-[var(--theme-bg-primary)] px-2.5 py-1 rounded-lg border border-[var(--theme-border-primary)] shadow-2xs">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-xs font-bold font-mono text-[var(--theme-text-primary)]">
          {starCount !== null ? starCount.toLocaleString() : '...'}
        </span>
      </div>
    </a>
  );
};

export default AboutGitHubSection;

