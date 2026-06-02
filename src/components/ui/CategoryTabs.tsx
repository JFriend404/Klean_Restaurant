import type { Category } from '@/types'

interface Props {
  categories: Category[]
  activeSlug: string
  onChange: (slug: string) => void
}

export function CategoryTabs({ categories, activeSlug, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
          activeSlug === 'all'
            ? 'bg-dark-500 border-brand-green text-white'
            : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-brand-green/50'
        }`}
      >
        🍽️ All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
            activeSlug === cat.slug
              ? 'bg-dark-500 border-brand-green text-white'
              : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-brand-green/50'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}