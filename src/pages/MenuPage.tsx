import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useFoods } from '@/hooks/useFoods'
import { useCategories } from '@/hooks/useCategories'
import { FoodCard } from '@/components/ui/FoodCard'
import { CategoryTabs } from '@/components/ui/CategoryTabs'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const { categories } = useCategories()
  const { foods, loading } = useFoods({ categorySlug: activeCategory, search })

  useEffect(() => {
    const s = searchParams.get('search')
    if (s) setSearch(s)
  }, [searchParams])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setSearchParams(value.trim() ? { search: value.trim() } : {})
  }

  const handleClearSearch = () => {
    setSearch('')
    setSearchParams({})
  }

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug)
    setSearchParams({})
    setSearch('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Menu</h1>
        <p className="text-gray-500 text-sm">Fresh, organic, delivered to your door</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search food here..."
          className="klean-input pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        activeSlug={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Grid */}
      {loading ? (
        <PageLoader />
      ) : foods.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No items found"
          description="Try a different category or search term"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  )
}