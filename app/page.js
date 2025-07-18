
import Header from "../components/Header/Header"
import Slider from "@/components/Slider/Slider";
import About from "@/components/About/About";
import Product from "@/components/Products/Products";
import ContactForm from "@/components/Contect_Us/Contect";
import Footer from "@/components/Footer/Footer";



export default function Home() {
  return (
    <main>
      <Header />
      <Slider />
      <About /> 
      <Product featuredOnly={true} showHero={true} />
      <ContactForm />
      <Footer />



    </main>
  );
}
