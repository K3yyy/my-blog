// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Home,
    Newspaper,      // for Articles
    Tags,           // for Topics
    Info,           // for About
    X,
    Menu
} from "lucide-react";

interface HeaderProps {
    onSubscribeClick: () => void;
}

export function Header({ onSubscribeClick }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Auto-close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <header className="container mx-auto py-5 relative z-50">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl md:text-3xl font-bold tracking-tight z-50"
                >
                    Keyy<span className="text-purple-500">Verse</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-10 text-base font-medium">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/articles/" className="text-gray-300 hover:text-white transition-colors">
                        Articles
                    </Link>
                    <Link href="/topics/" className="text-gray-300 hover:text-white transition-colors">
                        Topics
                    </Link>
                    <Link href="/about/" className="text-gray-300 hover:text-white transition-colors">
                        About
                    </Link>
                </nav>

                {/* Desktop Subscribe Button */}
                <Button
                    variant="outline"
                    className="hidden md:flex border-purple-500/70 text-purple-400 hover:bg-purple-950/40 hover:text-purple-300 hover:border-purple-400 transition-all duration-300"
                    onClick={onSubscribeClick}
                >
                    Subscribe
                </Button>

                {/* Hamburger Button (mobile only) */}
                <button
                    className="md:hidden z-50 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <X className="h-8 w-8 text-white" />
                    ) : (
                        <Menu className="h-8 w-8 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Slide-in Drawer */}
            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-gradient-to-b from-gray-950 via-gray-950 to-black/95
          backdrop-blur-xl border-r border-gray-800/40 shadow-2xl
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="relative flex flex-col h-full p-6 pt-20">
                    {/* Close button - only one now */}
                    <button
                        className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        {/*<X className="h-7 w-7" />*/}
                    </button>

                    {/* Logo inside menu (optional but looks nice) */}
                    <div className="mb-12">
            {/*<span className="text-2xl font-bold tracking-tight">*/}
            {/*  Weird<span className="text-purple-500">Wander</span>*/}
            {/*</span>*/}
                    </div>

                    {/* Navigation items with icons */}
                    <nav className="flex flex-col space-y-8 text-xl font-medium">
                        <Link
                            href="/"
                            className="flex items-center gap-4 text-gray-200 hover:text-purple-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Home className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            Home
                        </Link>

                        <Link
                            href="/articles/"
                            className="flex items-center gap-4 text-gray-200 hover:text-purple-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Newspaper className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            Articles
                        </Link>

                        <Link
                            href="/topics/"
                            className="flex items-center gap-4 text-gray-200 hover:text-purple-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Tags className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            Topics
                        </Link>

                        <Link
                            href="/about/"
                            className="flex items-center gap-4 text-gray-200 hover:text-purple-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Info className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            About
                        </Link>
                    </nav>

                    {/* Subscribe button at bottom */}
                    <div className="mt-auto pb-8">
                        <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-7 text-lg font-medium shadow-lg shadow-purple-900/30 transition-all duration-300"
                            onClick={() => {
                                closeMenu();
                                onSubscribeClick();
                            }}
                        >
                            Subscribe Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Backdrop - click to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={closeMenu}
                />
            )}
        </header>
    );
}