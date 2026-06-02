import { useNavigate } from 'react-router-dom'
import { ArrowRight, Leaf, Truck, Star } from 'lucide-react'
import { useFoods } from '@/hooks/useFoods'
import { FoodCard } from '@/components/ui/FoodCard'
import { PageLoader } from '@/components/ui/Spinner'

export function HomePage() {
  const navigate = useNavigate()
  const { foods, loading } = useFoods()
  const featured = foods.slice(0, 4)

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 border border-dark-500 min-h-[340px] flex items-center">
        <div className="relative z-10 p-8 md:p-12 max-w-lg">
          <p className="text-brand-green font-medium text-sm mb-2 tracking-wider uppercase">
            klean restaurant
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
            Welcome to our<br />restaurant
          </h1>
          <p className="font-script text-2xl text-brand-green-light mb-2">
            Pure Taste. Zero Mess.
          </p>
          <p className="font-script text-xl text-klean-gold mb-6">
            Discover the Klean Standard.
          </p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            We believe food should be transparent. We source our ingredients from
            local organic farms to ensure every bite is as fresh as it is flavorful.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="klean-btn-primary flex items-center gap-2"
          >
            Order now <ArrowRight size={16} />
          </button>
        </div>

        {/* Decorative burger image / gradient blob */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center">
          <div className="w-64 h-64 bg-brand-green/10 rounded-full blur-3xl absolute" />
          <span className="text-[160px] leading-none select-none opacity-80">🍔</span>
        </div>
      </section>

      {/* Value props */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Leaf, title: 'Organic', desc: 'Locally sourced fresh ingredients' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Hot food delivered to your door' },
          { icon: Star, title: 'Top Quality', desc: 'No hidden additives, honest food' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="klean-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-brand-green" />
            </div>
            <div>
              <p className="font-semibold text-white">{title}</p>
              <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Featured Items</h2>
          <button
            onClick={() => navigate('/menu')}
            className="text-brand-green text-sm hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Category descriptions */}
      <section className="space-y-4">
        {[
          {
            icon: '🍔',
            title: 'Our Burgers',
            subtitle: 'The Gold Standard of Grilling',
            desc: "Every burger is crafted with 100% organic, grass-fed beef or house-made plant‑based proteins. We believe in a 'zero mess' philosophy—just fresh ingredients like vine-ripened tomatoes and local greens on artisanal buns, delivered hot to your door.",
          },
          {
            icon: '🍰',
            title: 'Our Desserts',
            subtitle: 'Sweetness Without the Mystery',
            desc: 'Indulge in treats made from real, recognizable ingredients. From our velvety chocolate cake to our small-batch brownies, our desserts are free from hidden additives, ensuring every bite is as Klean as it is delicious.',
          },
          {
            icon: '☕',
            title: 'Our Drinks',
            subtitle: 'Pure Refreshment',
            desc: 'Whether you need the bold kick of a locally roasted Americano or a smooth, velvety Latte, our drinks are brewed to the highest standard. We prioritize pure taste in everything we serve.',
          },
        ].map(({ icon, title, subtitle, desc }) => (
          <div key={title} className="klean-card p-6 flex gap-5">
            <div className="w-16 h-16 rounded-2xl bg-dark-600 flex items-center justify-center text-3xl shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">{title}</h3>
              <p className="text-brand-green text-sm font-medium mb-1">{subtitle}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}