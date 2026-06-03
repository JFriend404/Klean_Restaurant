import { useState, useRef } from 'react'
import { Camera, LogOut, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { Spinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { profile, signOut } = useAuth()
  const { fetchProfile } = useAuthStore()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!profile) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()
  setSaving(true)
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: form.full_name, phone: form.phone, address: form.address })
    .eq('id', profile.id)

  if (error) {
    toast.error('Failed to update profile')
  } else {
    await fetchProfile(profile.id)
    toast.success('Profile updated!')
  }
  setSaving(false)
}

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${profile.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      toast.error('Failed to upload avatar')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = data.publicUrl + '?t=' + Date.now()

    await supabase
  .from('profiles')
  .update({ avatar_url: avatarUrl })
  .eq('id', profile.id)
    await fetchProfile(profile.id)
    toast.success('Avatar updated!')
    setUploading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Profile</h1>

      {/* Avatar */}
      <div className="klean-card p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-600 border-4 border-brand-green/40">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-brand-green">
                {profile.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center hover:bg-brand-green-dark transition-colors"
          >
            {uploading ? <Spinner size="sm" /> : <Camera size={14} />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-white text-lg">{profile.full_name || 'No name set'}</p>
          <p className="text-gray-500 text-sm">{profile.email}</p>
          <span className={`klean-badge mt-2 ${
            profile.role === 'admin'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-brand-green/20 text-brand-green border border-brand-green/30'
          }`}>
            {profile.role}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="klean-card p-5 space-y-4">
        <h2 className="font-semibold text-white">Account Information</h2>
        {[
          { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
          { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 890' },
          { name: 'address', label: 'Default Address', type: 'text', placeholder: '123 Main St, City' },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="text-gray-400 text-sm mb-1 block">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              placeholder={placeholder}
              className="klean-input"
            />
          </div>
        ))}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="klean-input opacity-50 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="klean-btn-primary w-full flex items-center justify-center gap-2"
        >
          {saving ? <Spinner size="sm" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="klean-btn-secondary w-full flex items-center justify-center gap-2 text-red-400 border-red-500/30 hover:border-red-500/60"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  )
}