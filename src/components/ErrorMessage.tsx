import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center p-4">
      <div className="inline-flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    </div>
  )
}
