
import Header from "../components/Header/Header"
import Slider from "@/components/Slider/Slider";
import About from "@/components/About/About";
import Products from "@/components/Products/Products";
import ContactForm from "@/components/Contect_Us/Contect";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Slider />
      <About /> 
      <Products />
      <ContactForm />
      <Footer />

    </>
  );
}
