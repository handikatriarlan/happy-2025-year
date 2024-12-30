import { useState, useEffect, useCallback, useRef } from "react"
import { supabase } from "../lib/supabase"
import { RealtimeChannel } from "@supabase/supabase-js"
import type { Wish } from "../types/wish"

const RETRY_DELAY = 2000
const MAX_RETRIES = 3

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const retryCountRef = useRef(0)

  const fetchWishes = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError
      if (data) {
        setWishes(data)
        setError(null)
        retryCountRef.current = 0
      }
    } catch (error) {
      console.error("Error fetching wishes:", error)
      setError("Failed to load wishes. Retrying...")

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1
        setTimeout(fetchWishes, RETRY_DELAY)
      } else {
        setError("Unable to load wishes. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setupRealtimeSubscription = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }

    channelRef.current = supabase
      .channel("wishes-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
        },
        (payload) => {
          const newWish = payload.new as Wish
          setWishes((current) =>
            [...current, newWish].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
          )
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchWishes()
    const cleanup = setupRealtimeSubscription()
    return cleanup
  }, [fetchWishes, setupRealtimeSubscription])

  return { wishes, isLoading, error }
}
