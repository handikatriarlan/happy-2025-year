import { useState } from "react"
import { WishForm } from "./components/WishForm"
import { WishList } from "./components/WishList"
import { Fireworks } from "./components/Fireworks"
import { Header } from "./components/Header"

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white relative overflow-hidden">
      <Fireworks />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <Header />

        <main className="space-y-12 md:space-y-16">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Our Wishes
            </h2>
            <WishList refreshTrigger={refreshTrigger} />
          </div>

          <div className="text-center">
            <WishForm
              onWishAdded={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </main>

        <footer className="text-center mt-12 md:mt-16 text-white/60 text-sm">
          <p>hope y'all will be happier next year. ❤️</p>
        </footer>
      </div>
    </div>
  )
}
