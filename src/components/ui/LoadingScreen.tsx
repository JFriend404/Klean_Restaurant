export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-dark-500 border-t-brand-green rounded-full animate-spin" />
        <p className="font-script text-2xl text-brand-green">Klean Restaurant</p>
      </div>
    </div>
  )
}