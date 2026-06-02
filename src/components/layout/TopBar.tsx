import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from '@/hooks/useAuth'

export function TopBar() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const totalItems = useCartStore((s) => s.totalItems)
  const { profile } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/menu?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-dark-800/80 backdrop-blur-md border-b border-dark-600 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Brand name */}
        <h1 className="font-script text-2xl text-white shrink-0">
          Klean Restaurant
        </h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search food here....."
              className="klean-input pl-9 py-2 text-sm"
            />
          </div>
        </form>

        {/* Cart + Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-xl bg-dark-600 hover:bg-dark-500 transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green rounded-full text-xs flex items-center justify-center font-bold">
                {totalItems()}
              </span>
            )}
          </button>

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-brand-green/40 cursor-pointer"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center cursor-pointer text-sm font-bold"
              onClick={() => navigate('/profile')}
            >
              {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="mt-3 sm:hidden">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search food here....."
            className="klean-input pl-9 py-2 text-sm"
          />
        </div>
      </form>
    </header>
  )
}