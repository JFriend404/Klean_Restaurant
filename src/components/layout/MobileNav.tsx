import { NavLink } from 'react-router-dom'
import { Home, UtensilsCrossed, Clock, User } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu', end: false },
  { to: '/orders', icon: Clock, label: 'History', end: false },
  { to: '/profile', icon: User, label: 'Profile', end: false },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 flex md:hidden z-50">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${
              isActive ? 'text-brand-green' : 'text-gray-500'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}