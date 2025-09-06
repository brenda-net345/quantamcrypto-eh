"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

export function BackgroundImage() {
  const pathname = usePathname()

  // Show the QuantumCrypto logo pattern on home and contact pages
  if (pathname === "/" || pathname === "/contact") {
    return (
      <div className="fixed inset-0 z-[-1]">
        {/* Create a tiled pattern of the QuantumCrypto logo */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/quantum-crypto-logo.jpg)",
            backgroundSize: "300px 300px",
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
          }}
        />
        {/* Add overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>
    )
  }

  // Show the original crypto trading background for other pages
  if (pathname !== "/" && pathname !== "/contact") {
    return (
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample_0%20(2).jpg-16JyX6876wQ8FD5anG58Saa3Jmj3JL.jpeg"
          alt="Crypto trading background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className="opacity-100"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </div>
    )
  }

  return null
}
