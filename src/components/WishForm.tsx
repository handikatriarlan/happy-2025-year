import React, { useState } from "react"
import { Send, Plus } from "lucide-react"
import { supabase } from "../lib/supabase"
import { Modal } from "./Modal"

export function WishForm({ onWishAdded }: { onWishAdded: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [wish, setWish] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !wish.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("wishes").insert([
        {
          name: name.trim(),
          wish: wish.trim(),
        },
      ])

      if (error) throw error

      setName("")
      setWish("")
      setIsModalOpen(false)
      onWishAdded()
    } catch (error) {
      console.error("Error submitting wish:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        Share Your Wish for 2025
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Share Your Wish
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white/80 mb-1"
            >
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="wish"
              className="block text-sm font-medium text-white/80 mb-1"
            >
            </label>
            <textarea
              id="wish"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="What's your wish for the new year?"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-200 h-32 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Sending..." : "Share Wish"}
          </button>
        </form>
      </Modal>
    </>
  )
}
