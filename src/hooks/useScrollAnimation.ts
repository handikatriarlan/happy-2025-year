import { useState, useCallback, useEffect } from "react"
import { useAnimationControls } from "framer-motion"
import type { Wish } from "../types/wish"

export function useScrollAnimation(
  containerRef: React.RefObject<HTMLDivElement>,
  wishes: Wish[]
) {
  const [width, setWidth] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const controls = useAnimationControls()

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth / 2
      const clientWidth = containerRef.current.clientWidth
      setWidth(scrollWidth - clientWidth)
    }
  }, [containerRef])

  const startAutoScroll = useCallback(() => {
    if (!isAutoScrolling || width <= 0) return

    controls.start({
      x: -width,
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    })
  }, [controls, width, isAutoScrolling])

  useEffect(() => {
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [updateWidth, wishes])

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll()
    }
  }, [startAutoScroll, isAutoScrolling, wishes])

  return {
    width,
    isAutoScrolling,
    setIsAutoScrolling,
    startAutoScroll,
    controls,
  }
}
