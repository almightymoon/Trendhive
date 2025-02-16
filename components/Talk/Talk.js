const Talk = () => {
    return (
        <section className="bg-[#32aa27] text-white py-16">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-28">
                    <div>
                        <h2 className="text-6xl font-bold">Let's talk</h2>
                        <p className="mt-2 text-lg">We would love to hear from you!</p>
                    </div>
                    <a
                        href="/contact"
                        className="border-2 border-white text-white px-6 py-3  hover:bg-white hover:text-green-600 transition"
                    >
                        GET IN TOUCH
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Talk;
