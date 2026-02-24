"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"  // ← your original Header component

export default function HeaderClient() {
    const router = useRouter()

    const handleSubscribeClick = () => {
        router.push("/#newsletter")
    }

    return <Header onSubscribeClick={handleSubscribeClick} />
}