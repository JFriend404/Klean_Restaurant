import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LoadingScreen() {
  const [timedOut, setTimedOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (timedOut) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="font-script text-2xl text-brand-green">Klean Restaurant</p>
          <p className="text-gray-400 text-sm">Taking too long to load...</p>
          <button
            onClick={() => navigate('/login')}
            className="klean-btn-primary mt-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-dark-500 border-t-brand-green rounded-full animate-spin" />
        <p className="font-script text-2xl text-brand-green">Klean Restaurant</p>
      </div>
    </div>
  )
}