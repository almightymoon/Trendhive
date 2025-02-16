"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import Talk from "@/components/Talk/Talk";

const featuredProducts = [
    {
        id: "eco-friendly-tote-bag",
        title: "Eco-Friendly Tote Bag",
        description: "Chic and sustainable tote for everyday use.",
        image: "/tote-bag.jpeg",
        details: "Make a sustainable fashion statement with our Eco-Friendly Tote Bag. Crafted from 100% organic cotton, this stylish and spacious tote is perfect for shopping, beach days, or everyday errands. Its durable fabric ensures longevity, while the eye-catching design adds a touch of flair to any outfit. The comfortable straps make it easy to carry, and its lightweight nature means you can fold it up and take it anywhere. Say goodbye to plastic bags and embrace an eco-conscious lifestyle with this chic accessory that’s both functional and fashionable."
    },
    {
        id: "wireless-noise-cancelling-headphones",
        title: "Wireless Noise-Cancelling Headphones",
        description: "Experience premium sound with noise cancellation.",
        image: "/headphones.jpeg",
        details: "Immerse yourself in crystal-clear sound with our Wireless Noise-Cancelling Headphones. Designed for audiophiles and casual listeners alike, these headphones use advanced noise-cancellation technology to block out distractions, letting you focus on your music or podcasts. With a comfortable fit and long-lasting battery life, you can enjoy hours of uninterrupted listening. The sleek design complements any style, and the built-in microphone makes it easy to take calls on the go. Elevate your audio experience and escape into a world of sound with these premium headphones that redefine convenience and quality."
    },
    {
        id: "smart-fitness-tracker",
        title: "Smart Fitness Tracker",
        description: "Track your health with style and precision.",
        image: "/fitness-tracker.jpeg",
        details: "Stay on top of your health with our Smart Fitness Tracker. This sleek device monitors your heart rate, steps, and sleep patterns, providing you with valuable insights into your daily activity levels. Sync it with your smartphone to track progress and set fitness goals. The user-friendly interface and customizable watch faces make it easy to personalize, while the waterproof design allows for worry-free workouts. With notifications for calls and messages, this tracker keeps you connected without the need to check your phone constantly. Embrace a healthier lifestyle and transform your fitness journey with this essential gadget."
    },
];

const ProductPage = () => {
    const { id } = useParams();
    const product = featuredProducts.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
                <Link href="/products" className="text-blue-500 underline mt-4 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto py-12 px-6 pt-32 pb-32">
                <div className="p-6">
                    <Link href="/products" className="text-green-600 text-justify hover:underline mb-4 block">
                        ← Back to Products
                    </Link>

                    {/* Move h1 outside of p */}
                    <motion.h1
                        initial={{ opacity: 0, y: 180 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl font-bold text-green-600"
                    >
                        {product.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 180 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-gray-600 mt-2 font-[Poppins] text-lg"
                    >
                        {product.details}
                    </motion.p>
                </div>

                <div className="bg-white w-[94%] mx-auto rounded-lg shadow-lg overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Image
                            src={product.image}
                            alt={product.title}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                        />
                    </motion.div>
                </div>
            </div>
            <Talk/>
            <Footer />
        </>
    );
};

export default ProductPage;
