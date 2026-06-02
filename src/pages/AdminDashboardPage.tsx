import { useState } from 'react'
import { AdminFoodsTab } from '@/components/admin/AdminFoodsTab'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { UtensilsCrossed, ClipboardList } from 'lucide-react'

type Tab = 'foods' | 'orders'

export function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('foods')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your restaurant</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-600 pb-0">
        {([
          { id: 'foods', label: 'Menu Items', icon: UtensilsCrossed },
          { id: 'orders', label: 'Orders', icon: ClipboardList },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map(
          ({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === id
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        )}
      </div>

      {tab === 'foods' ? <AdminFoodsTab /> : <AdminOrdersTab />}
    </div>
  )
}