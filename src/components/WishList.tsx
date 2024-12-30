import { useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { WishCard } from "./WishCard"
import { useWishes } from "../hooks/useWishes"
import { LoadingSpinner } from "./LoadingSpinner"
import { ErrorMessage } from "./ErrorMessage"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export function WishList() {
  const { wishes, isLoading, error } = useWishes()
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const { width, setIsAutoScrolling, startAutoScroll } =
    useScrollAnimation(containerRef, wishes)

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const duplicatedWishes = [...wishes, ...wishes]

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto overflow-hidden"
      onMouseEnter={() => {
        setIsAutoScrolling(false)
        controls.stop()
      }}
      onMouseLeave={() => {
        setIsAutoScrolling(true)
        startAutoScroll()
      }}
    >
      <motion.div
        className="flex gap-6 py-8 px-4"
        animate={controls}
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        onDragStart={() => {
          setIsAutoScrolling(false)
          controls.stop()
        }}
        onDragEnd={() => {
          setIsAutoScrolling(true)
          startAutoScroll()
        }}
        dragElastic={0.1}
        dragMomentum={true}
      >
        {duplicatedWishes.map((wish, index) => (
          <WishCard key={`${wish.id}-${index}`} wish={wish} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
