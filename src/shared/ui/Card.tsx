'use client';

import { ReactNode, useState } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
};

export const Card = ({
  children,
  className = '',
  title,
  collapsible = false,
  defaultExpanded = false,
}: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {title && (
        <div
          className={`flex items-center justify-between p-4 ${
            collapsible
              ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              : ''
          }`}
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {collapsible && (
            <span className="text-gray-500 dark:text-gray-400">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
      )}
      {(!collapsible || isExpanded) && (
        <div className={`${title ? 'px-4 pb-4' : 'p-4'}`}>{children}</div>
      )}
    </div>
  );
};
