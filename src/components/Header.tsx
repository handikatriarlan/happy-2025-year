import { PartyPopper, Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="text-center mb-12 md:mb-16">
      <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md px-6 md:px-8 py-2 md:py-3 rounded-full mb-4 md:mb-6 border border-white/20">
        <PartyPopper className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
          Happy New Year 2025!
        </h1>
        <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />
      </div>
      <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg px-4">
        Welcome to our vibrant community of dreamers and wishmakers! Share your
        aspirations, hopes, and dreams for 2025. Together, let's create a
        tapestry of inspiration that lights up the year ahead. 🌟
      </p>
    </header>
  )
}
