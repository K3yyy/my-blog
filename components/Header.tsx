"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, Tags, Info, X, Menu } from "lucide-react";

interface HeaderProps {
    onSubscribeClick: () => void;
}

export function Header({ onSubscribeClick }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Auto-close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // initial check

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/20">
                <div className="container mx-auto px-4 py-5 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl md:text-3xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
                    >
                        Keyy<span className="text-blue-500">Verse</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-10 text-base font-medium">
                        <Link
                            href="/"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/articles"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Articles
                        </Link>
                        <Link
                            href="/topics"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Topics
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Desktop Subscribe Button */}
                    <Button
                        variant="outline"
                        className="hidden md:flex border-blue-500/60 text-blue-400 hover:bg-blue-950/40 hover:text-blue-300 hover:border-blue-400 transition-all duration-300"
                        onClick={onSubscribeClick}
                    >
                        Subscribe
                    </Button>

                    {/* Mobile Hamburger */}
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
            </header>

            {/* Invisible spacer to prevent content overlap */}
            <div className="h-20 md:h-24" aria-hidden="true" />

            {/* Mobile Slide-in Menu */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-gradient-to-b from-gray-950 via-gray-950 to-black/95 backdrop-blur-xl border-r border-gray-800/40 shadow-2xl transform transition-transform duration-500 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="relative flex flex-col h-full p-6 pt-20">
                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-8 text-xl font-medium">
                        <Link
                            href="/"
                            className="flex items-center gap-4 text-gray-200 hover:text-blue-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Home className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            Home
                        </Link>

                        <Link
                            href="/articles"
                            className="flex items-center gap-4 text-gray-200 hover:text-blue-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Newspaper className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            Articles
                        </Link>

                        <Link
                            href="/topics"
                            className="flex items-center gap-4 text-gray-200 hover:text-blue-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Tags className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            Topics
                        </Link>

                        <Link
                            href="/about"
                            className="flex items-center gap-4 text-gray-200 hover:text-blue-400 transition-colors group"
                            onClick={closeMenu}
                        >
                            <Info className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            About
                        </Link>
                    </nav>

                    {/* Subscribe at bottom */}
                    <div className="mt-auto pb-8">
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-7 text-lg font-medium shadow-lg shadow-purple-900/30 transition-all duration-300"
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

            {/* Backdrop overlay when menu is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={closeMenu}
                />
            )}
        </>
    );
}