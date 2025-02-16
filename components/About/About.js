"use client"
import Image from "next/image"
import { useEffect } from "react";
const About = () => {

  return (
    <section id="About" className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 gap-10">
      {/* Left Content */}
      <div className="md:w-1/2 text-left">
        <p className="text-green-600 font-semibold uppercase tracking-wide">Discover TrendHive</p>
        <h1 className="text-4xl md:text-3xl font-bold text-gray-900 leading-tight mt-2">
          Your one-stop online shopping destination
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          TrendHive is your ultimate online shopping companion, offering a wide variety of products
          to cater to all your needs. From the latest gadgets to stylish fashion items, we have something for everyone.
          Located in PK, we pride ourselves on providing quality products at competitive prices,
          ensuring a seamless shopping experience for our customers. Join the TrendHive community today!
        </p>
        {/* Link */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-6 inline-block text-black font-semibold underline cursor-pointer"
        >
          Get in touch
        </a>

      </div>

      {/* Right Image */}
      <div className="md:w-1/2 mt-10 md:mt-0">
        <Image
          src="/laptop.jpeg"
          alt="Laptop"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>


  )

}
export default About;
