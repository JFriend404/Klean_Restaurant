import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Welcome to Klean Restaurant 🎉')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold font-script">K</span>
          </div>
          <h1 className="font-script text-3xl text-white">Klean Restaurant</h1>
          <p className="text-gray-500 text-sm mt-1">Pure Taste. Zero Mess.</p>
        </div>

        <div className="klean-card p-6 space-y-5">
          <h2 className="font-display text-xl font-semibold text-white">Create account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                <input
                  type={type}
                  value={form[name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="klean-input"
                />
              </div>
            ))}

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="klean-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="••••••••"
                required
                className="klean-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="klean-btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Spinner size="sm" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}