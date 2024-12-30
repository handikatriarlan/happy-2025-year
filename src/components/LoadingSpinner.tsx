export function LoadingSpinner() {
  return (
    <div className="text-center p-4">
      <div className="inline-flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-lg">
        <div className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        <span>Loading wishes...</span>
      </div>
    </div>
  )
}
