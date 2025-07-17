"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredProducts = [
    {
        id: "eco-friendly-tote-bag",
        title: "Eco-Friendly Tote Bag",
        description: "Chic and sustainable tote for everyday use.",
        image: "/tote-bag.jpeg",
        details: "Make a sustainable fashion statement with our Eco-Friendly Tote Bag. Crafted from 100% organic cotton, this stylish and spacious tote is perfect for shopping, beach days, or everyday errands. Its durable fabric ensures longevity, while the eye-catching design adds a touch of flair to any outfit. The comfortable straps make it easy to carry, and its lightweight nature means you can fold it up and take it anywhere. Say goodbye to plastic bags and embrace an eco-conscious lifestyle with this chic accessory that’s both functional and fashionableMake a sustainable fashion statement with our Eco-Friendly Tote Bag. Crafted from 100% organic cotton, this stylish and spacious tote is perfect for shopping, beach days, or everyday errands. Its durable fabric ensures longevity, while the eye-catching design adds a touch of flair to any outfit. The comfortable straps make it easy to carry, and its lightweight nature means you can fold it up and take it anywhere. Say goodbye to plastic bags and embrace an eco-conscious lifestyle with this chic accessory that’s both functional and fashionable"
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

const Product = () => {
    const productList = [
        { id: "eco-friendly-tote-bag", name: "Eco-Friendly Tote Bag" },
        { id: "another-product", name: "Another Product" },
    ];
    return (
        <div id="Products" className="relative w-full">
            {/* HERO SECTION */}
            <section className="w-full bg-gray-100 pt-20 pb-10">
                <div className="max-w-6xl mx-auto text-left px-6">
                    <p className="text-green-600 font-semibold uppercase tracking-wide">
                        Explore The Trends
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-2">
                        Discover unique items for every lifestyle
                    </h1>
                </div>

                {/* FEATURED PRODUCTS */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
             <div
             key={product.id}
             className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
           >
             <Link href={`/products/${product.id}`} className="block">
               <div className="overflow-hidden">
                 <Image
                   src={product.image}
                   alt={product.title}
                   width={400}
                   height={300}
                   className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                 />
               </div>
               <div className="p-4">
                 {/* Product Name with Gradient Effect on Hover */}
                 <h3
                   className="text-lg font-bold text-gray-600 transition-all duration-300 
                              group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:via-green-900 group-hover:to-green-500 
                              group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-gradient"
                 >
                   {product.title}
                 </h3>
                 <p className="text-gray-600 mt-2 ">{product.description}</p>
               </div>
             </Link>
           </div>
           
                   
                    ))}
                </section>

            </section>
        </div>
    );
};

export default Product;
