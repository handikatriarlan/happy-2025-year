import { useEffect, useState, useRef, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { motion, useAnimationControls, useDragControls } from "framer-motion"
import { formatDate } from "../utils/dateFormatter"

interface Wish {
  id: string
  name: string
  wish: string
  created_at: string
}

export function WishList({ refreshTrigger }: { refreshTrigger: number }) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const controls = useAnimationControls()
  const dragControls = useDragControls()
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const autoScrollInterval = useRef<NodeJS.Timeout>()
  const lastPosition = useRef(0)

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth / 2
      const clientWidth = containerRef.current.clientWidth
      setWidth(scrollWidth - clientWidth)
    }
  }, [])

  useEffect(() => {
    const fetchWishes = async () => {
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: true })

      if (data) {
        setWishes(data)
        if (refreshTrigger > 0 && data.length > 0) {
          controls.start({ x: 0 })
          setIsAutoScrolling(true)
          startAutoScroll()
        }
      }
    }

    fetchWishes()
  }, [refreshTrigger, controls])

  useEffect(() => {
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [updateWidth, wishes.length])

  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current)
    }

    if (!isAutoScrolling) return

    const scroll = async () => {
      if (!isDragging && width > 0) {
        await controls.start({
          x: -width,
          transition: {
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        })
      }
    }

    scroll()
  }, [controls, width, isDragging, isAutoScrolling])

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll()
    }
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current)
      }
    }
  }, [startAutoScroll, isAutoScrolling])

  const handleDragStart = () => {
    setIsDragging(true)
    setIsAutoScrolling(false)
    controls.stop()
  }

  const handleDragEnd = (
    event: MouseEvent | TouchEvent,
    info: { point: { x: number } }
  ) => {
    setIsDragging(false)
    lastPosition.current = info.point.x
    setIsAutoScrolling(true)
    startAutoScroll()
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
        dragControls={dragControls}
        dragConstraints={{ right: 0, left: -width }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
        dragMomentum={true}
      >
        {duplicatedWishes.map((wish, index) => (
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
        ))}
      </motion.div>
    </div>
  )
}
