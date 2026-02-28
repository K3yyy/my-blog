// components/Footer.tsx
import Link from "next/link";
import {Facebook, Github, Instagram, Linkedin, Mail, Rss, Twitter} from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
            <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:gap-12  xl:gap-16">
                    {/* Brand + Description + Socials */}
                    <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start gap-5">
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tight text-white"
                        >
                            Keyy<span className="text-blue-500">verse</span>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-md text-center md:text-left">
                            Discovering the strange, enjoying the weird side of life, and
                            learning something unexpected every day.
                        </p>

                        <div className="flex items-center gap-5 mt-2">
                            <SocialLink href="https://www.facebook.com/K3y_yyy" icon={Facebook}  />
                            <SocialLink href="https://www.instagram.com/k3y_yy/" icon={Instagram} />
                            <SocialLink href="https://github.com/K3yyy" icon={Github} />
                            <SocialLink href="https://www.linkedin.com/in/yun-menghuy-0270a0303" icon={Linkedin} />
                            <SocialLink href="https://x.com/k3y_yy?s=21" icon={Twitter} />
                        </div>
                    </div>

                    {/* Topics */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 tracking-wide">Topics</h3>
                        <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                            <FooterLink href="#">Tech</FooterLink>
                            <FooterLink href="#">Travel</FooterLink>
                            <FooterLink href="#">Lifestyle</FooterLink>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 tracking-wide">Resources</h3>
                        <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                            <FooterLink href="#">Blog</FooterLink>
                            <FooterLink href="#">Guides</FooterLink>
                            <FooterLink href="#">Newsletter</FooterLink>
                        </div>
                    </div>

                    {/* Contact */}

                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>© {currentYear} Owned Keyy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

/* Reusable small components */

function SocialLink({
                        href,
                        icon: Icon,
                    }: {
    href: string;
    icon: typeof Twitter;
}) {
    return (
        <Link
            href={href}
            target="_blank"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Social link"
        >
            <Icon className="h-5 w-5" />
        </Link>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            target="_blank"
            className="hover:text-white transition-colors duration-150"
        >
            {children}
        </Link>
    );
}