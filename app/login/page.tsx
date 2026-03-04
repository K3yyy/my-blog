// app/login/page.tsx
import { Suspense } from 'react'
import {LoginForm} from "@/app/login/LoginForm";


export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
                    Loading authentication...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    )
}