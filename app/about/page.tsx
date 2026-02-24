"use client"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

export default function AboutPage() {
    const router = useRouter()

    const handleSubscribeClick = () => {
        router.push("/#newsletter")
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">About Blog</h1>

                    <div className="prose prose-invert prose-purple max-w-none">
                        <p className="text-xl text-gray-300 mb-8">
                            Keyyverse is all about <strong>Discover the Weird, Enjoy Life, Learn Something Unexpected Every Day</strong>.
                        </p>

                        <p className="mb-8">
                            Life feels predictable—until it throws you a curveball that makes you laugh, gasp, or just stare in disbelief. One minute you're going about your day, the next you're hit with the knowledge that strawberries aren't berries... but bananas are.
                        </p>



                        <p className="mb-8">
                            Or that octopuses have three hearts, blue blood, and can instantly change color and texture to vanish into the background—or just to troll a nearby fish for fun.
                        </p>




                        <h2 className="text-blue-500 font-bold">Mission</h2>
                        <p>
                            We chase down the strangest corners of the world—bizarre historical coincidences, mind-bending animal quirks, random life moments that feel scripted by a prankster universe—and share them in a way that's fun, lighthearted, and impossible to forget. The goal? Spark that tiny "wait, really?" moment that turns an ordinary Tuesday into something magical.
                        </p>

                        <h2 className="text-blue-500 font-bold">What We Dive Into</h2>
                        <p>Here's a taste of the weirdness we love exploring:</p>
                        <ul>
                            <li>
                                <strong>Strange Facts</strong>: Like how some woolly mammoths were still around centuries after the pyramids were built...
                            </li>


                            <li>
                                <strong>Quirky Discoveries</strong>: Accidental inventions (saccharin from unwashed hands, anyone?), historical oddities, and those "how did that even happen?" stories.
                            </li>
                            <li>
                                <strong>Odd Life Moments</strong>: Mass hysterias, mystery seeds in the mail, people surviving impossible coincidences, or mistaking a hat pom-pom for a baby hedgehog.
                            </li>
                            <li>
                                <strong>Joy of the Unexpected</strong>: Celebrating how stumbling on something bizarre reminds us the world is full of wonder, humor, and delightful absurdity.
                            </li>
                        </ul>

                        <h2 className="text-blue-500 font-bold">Our Vibe</h2>
                        <p>
                            Run by one curious weirdo (hey, that's me—Keyy!) who believes learning shouldn't feel like school—it should feel like eavesdropping on the universe's best inside jokes. We keep it accessible, silly when it wants to be, mind-bending when it needs to, and always celebratory of life's glorious unpredictability.
                        </p>


                        <h2 className="text-blue-500 font-bold">Get in Touch</h2>
                        <p>
                            Got a weird fact, a personal odd life moment, or just want to say hi? Drop me a line at{" "}
                            <a  href="mailto:yunmenghuy33@gmail.com?subject=Hello%20Keyy&body=Hi%20there!" className="text-purple-400 hover:text-purple-300">
                                yunmenghuy33@gmail.com
                            </a>
                            . I love hearing the strange stuff you've discovered!
                        </p>

                        <p className="italic text-gray-400 mt-8">
                            Stay curious. Stay weird. And never stop enjoying the unexpected.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}