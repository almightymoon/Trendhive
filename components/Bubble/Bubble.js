"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Bubbles() {
  const [mounted, setMounted] = useState(false);
  const numBubbles = 15; // Number of bubbles

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR mismatch

  // Generate an array of bubbles with random positions and animations
  const bubbles = Array.from({ length: numBubbles }).map((_, index) => {
    const size = Math.random() * 80 + 40; // Random size between 40 and 120
    const initialLeft = Math.random() * 100; // Initial horizontal position
    const initialTop = Math.random() * 100; // Initial vertical position
    const duration = Math.random() * 6 + 3; // Random speed between 5 and 15 seconds

    return (
      <motion.div
        key={index}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [
            `${Math.random() * 50 - 25}vw`, // Random horizontal movement
            `${Math.random() * 50 - 25}vw`,
          ],
          y: [
            `${Math.random() * 50 - 25}vh`, // Random vertical movement
            `${Math.random() * 50 - 25}vh`,
          ],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="absolute bg-green-400 rounded-full opacity-30 blur-md"
        style={{
          width: size,
          height: size,
          left: `${initialLeft}%`,
          top: `${initialTop}%`,
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{bubbles}</div>;
}
