import { NavLink } from 'react-router-dom'
import { Home, UtensilsCrossed, Clock, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu', end: false },
  { to: '/orders', icon: Clock, label: 'History', end: false },
  { to: '/profile', icon: User, label: 'Profile', end: false },
]

export function Sidebar() {
  const { isAdmin } = useAuth()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-24 bg-dark-800 border-r border-dark-600 flex-col items-center py-6 gap-2 z-40">
      {/* Logo */}
      <div className="mb-4 w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-sm">K</span>
      </div>

      <nav className="flex flex-col items-center gap-1 w-full px-2">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link w-full ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link w-full ${isActive ? 'active' : ''}`
            }
          >
            <LayoutDashboard size={20} />
            <span className="text-xs">Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}