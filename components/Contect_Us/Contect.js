"use client";

import { useState } from "react";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <section id="contact">
            <div className="max-w-6xl mx-auto px-6 py-12 lg:flex lg:gap-12">
                {/* Contact Form */}
                <div className="w-full lg:w-2/3">
                    <h2 className="text-green-600 font-semibold uppercase tracking-wide">Get in Touch</h2>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">We're here to help you!</h1>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
                                placeholder="Jane Smith"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
                                placeholder="email@website.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
                                placeholder="555-555-5555"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
                                placeholder="Your message..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                                I allow this website to store my submission so they can respond to my inquiry. *
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="w-full lg:w-1/3 mt-10 lg:mt-0 bg-gray-100 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold">Get in touch</h2>
                    <p className="text-gray-600 mt-2">
                        📧 <a href="mailto:almightymooon@gmail.com" className="text-green-600 hover:underline">almightymooon@gmail.com</a>
                    </p>

                    <h2 className="text-xl font-semibold mt-6">Hours</h2>
                    <ul className="mt-2 text-gray-600">
                        {[
                            { day: "Monday", hours: "9:00am - 10:00pm" },
                            { day: "Tuesday", hours: "9:00am - 10:00pm" },
                            { day: "Wednesday", hours: "9:00am - 10:00pm" },
                            { day: "Thursday", hours: "9:00am - 10:00pm" },
                            { day: "Friday", hours: "9:00am - 10:00pm" },
                            { day: "Saturday", hours: "9:00am - 10:00pm" },
                            { day: "Sunday", hours: "9:00am - 12:00pm" },
                        ].map(({ day, hours }) => (
                            <li key={day} className="flex justify-between w-full border-b py-1">
                                <span>{day}</span>
                                <span className="font-medium">{hours}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    );
};

export default ContactForm;
