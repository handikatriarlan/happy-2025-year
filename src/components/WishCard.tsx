import { motion } from "framer-motion"
import { formatDate } from "../utils/dateFormatter"
import type { Wish } from "../types/wish"

interface WishCardProps {
  wish: Wish
  index: number
}

export function WishCard({ wish, index }: WishCardProps) {
  return (
    <motion.div
      key={`${wish.id}-${index}`}
      className="min-w-[300px] md:min-w-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl flex-shrink-0 hover:from-white/15 hover:to-white/10 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
            {wish.name}'s Wish
          </h3>
          <p className="text-sm text-white/60">
            {formatDate(new Date(wish.created_at))}
          </p>
        </div>
        <p className="text-base md:text-lg text-white/90 flex-grow">
          {wish.wish}
        </p>
      </div>
    </motion.div>
  )
}
