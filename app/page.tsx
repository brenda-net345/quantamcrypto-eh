import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-8 py-8 lg:py-12">
          <div className="w-full lg:w-5/12 flex-shrink-0 order-2 lg:order-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b77ad424c36d8c2d29b8576e7469909d63d1a321_2_441x500-phIccZ0pi76jUFI8KeD5z9bNSFlTF6.jpeg"
              alt="Bitcoin Core Wallet Interface"
              width={400}
              height={452}
              className="rounded-lg shadow-md mx-auto lg:mx-0 w-full max-w-sm lg:max-w-md h-auto"
              priority
            />
          </div>
          <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 lg:-ml-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 logo-pattern-bg">
              <span className="block">Trade Crypto with</span>
              <span className="block">Confidence</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 whitespace-nowrap logo-pattern-bg">
              Join Quantum<span className="text-orange-500">Crypto</span> to trade BTC, ETH, and USDT securely.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mt-1 logo-pattern-bg">
              Trusted by <span className="text-orange-500 font-semibold">over 500k users</span> worldwide
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mt-2 logo-pattern-bg">
              Guaranteed 24/7 withdrawals
            </p>
            <Link href="/login" className="mt-6">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base sm:text-lg px-8 py-4 shadow-2xl border-2 border-orange-400 hover:border-orange-300 flash-blink-effect"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="py-6 px-4 border-t border-gray-700/50">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-300 logo-pattern-bg">
            Copyright © 2019 - 2025 Quantum<span className="text-orange-500">Crypto</span>.site. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
