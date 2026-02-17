// components/Footer.tsx
import Link from "next/link";
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-800 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="text-xl font-bold tracking-tighter">
                            Weird<span className="text-purple-500">Wander</span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Discovering the strange, enjoying the weird side of life, and learning
                            something unexpected every day.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white">
                                <Rss className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Topics, Resources, Contact sections – same as before */}
                    {/* ... */}
                </div>

                <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} WeirdWander. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}