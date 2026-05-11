export function SkeletonLine({ width = 'full', height = '4' }) {
  return (
    <div className={`h-${height} w-${width} bg-brand-card rounded-lg animate-pulse`} />
  )
}

export function SkeletonPersonaCard() {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-brand-card animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-brand-card rounded-lg animate-pulse" />
        <div className="h-3 w-32 bg-brand-card rounded-lg animate-pulse" />
        <div className="h-3 w-48 bg-brand-card rounded-lg animate-pulse" />
      </div>
    </div>
  )
}

export function SkeletonMessage({ isUser = false }) {
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-brand-card animate-pulse shrink-0" />}
      <div className={`space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`h-10 ${isUser ? 'w-32' : 'w-48'} bg-brand-card rounded-2xl animate-pulse`} />
        <div className="h-2 w-12 bg-brand-card rounded animate-pulse" />
      </div>
    </div>
  )
}

export function SkeletonProfileStat() {
  return (
    <div className="bg-brand-surface rounded-xl p-3 text-center space-y-2">
      <div className="h-8 w-12 bg-brand-card rounded-lg animate-pulse mx-auto" />
      <div className="h-3 w-20 bg-brand-card rounded animate-pulse mx-auto" />
    </div>
  )
}