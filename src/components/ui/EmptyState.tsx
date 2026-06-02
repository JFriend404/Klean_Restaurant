interface Props {
  icon: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-6xl">{icon}</span>
      <div>
        <p className="text-xl font-semibold text-white">{title}</p>
        {description && (
          <p className="text-gray-500 mt-1 text-sm max-w-xs mx-auto">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}