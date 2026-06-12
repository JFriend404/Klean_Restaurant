import { useState, useEffect } from 'react'
import { AdminFoodsTab } from '@/components/admin/AdminFoodsTab'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { UtensilsCrossed, ClipboardList, ShoppingBag, DollarSign, Clock, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Tab = 'foods' | 'orders'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalFoods: number
}

export function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('foods')
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalFoods: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, foodsRes] = await Promise.all([
        supabase.from('orders').select('status, total_amount'),
        supabase.from('foods').select('id'),
      ])

      const orders = ordersRes.data || []
      const foods = foodsRes.data || []

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        totalFoods: foods.length,
      })
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-brand-green',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      label: 'Menu Items',
      value: stats.totalFoods,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your restaurant</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`klean-card p-4 border ${bg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium">{label}</p>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
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
              {id === 'orders' && stats.pendingOrders > 0 && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          )
        )}
      </div>

      {tab === 'foods' ? <AdminFoodsTab /> : <AdminOrdersTab />}
    </div>
  )
}