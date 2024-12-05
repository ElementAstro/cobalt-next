import React from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  path: string[]
  onNavigate: (path: string[]) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <button
        onClick={() => onNavigate([])}
        className="hover:underline"
      >
        Home
      </button>
      {path.map((folder, index) => (
        <React.Fragment key={folder}>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className="hover:underline"
          >
            {folder}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}

