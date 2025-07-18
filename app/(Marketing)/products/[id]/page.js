"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useState, useEffect } from "react";
import { useCart } from "@/app/Contexts/CartContext";
import jwt_decode from "jwt-decode";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "@/components/PayPalButton";
import { ShoppingCart } from "lucide-react";
import { Star, CheckCircle, Tag, Package, Truck, Info, ChevronDown, ChevronUp } from "lucide-react";

const ADD_SOUND_URL = "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3";
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export default function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingStripe, setLoadingStripe] = useState(false);
    const [loadingPaypal, setLoadingPaypal] = useState(false);
    const [paypalSuccess, setPaypalSuccess] = useState(false);
    const [paypalError, setPaypalError] = useState("");
    const [animating, setAnimating] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [related, setRelated] = useState([]);

    
    async function handleStripeCheckout() {
        setLoadingStripe(true);
        // Get userId from token
        const token = localStorage.getItem("token");
        let userId = "";
        if (token) {
          try {
            const decoded = jwt_decode(token);
            userId = decoded.userId;
          } catch (e) {}
        }
        // Build a single-item cart for this product
        const cartItem = {
          title: product.name,
          price: product.price,
          image: product.mainImage,
          quantity: 1,
        };
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: [cartItem], userId })
        });
        const data = await res.json();
        setLoadingStripe(false);
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Stripe checkout failed");
        }
      }

    // PayPal handlers
    const cartItem = product ? [{
      title: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: 1,
    }] : [];

    async function createOrderHandler() {
      setLoadingPaypal(true);
      setPaypalError("");
      try {
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", cart: cartItem })
        });
        const data = await res.json();
        setLoadingPaypal(false);
        if (data.orderID) return data.orderID;
        setPaypalError(data.error || "Failed to create PayPal order");
        return "";
      } catch (err) {
        setLoadingPaypal(false);
        setPaypalError("Network error");
        return "";
      }
    }

    async function onApproveHandler(data) {
      setLoadingPaypal(true);
      setPaypalError("");
      try {
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "capture", orderID: data.orderID })
        });
        const result = await res.json();
        setLoadingPaypal(false);
        if (result.success) {
          const idStr = orderId && orderId.toString ? orderId.toString() : orderId;
          window.location.href = `/order-success?order_id=${idStr}`;
        } else {
          setPaypalError(result.error || "PayPal payment failed");
        }
      } catch (err) {
        setLoadingPaypal(false);
        setPaypalError("Network error");
      }
    }

    useEffect(() => {

        async function fetchProduct() {
            setLoading(true);
            const res = await fetch(`/api/admin/products?id=${id}`);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setProduct(data[0]);
                setMainImage(data[0].mainImage || (data[0].images && data[0].images[0]) || "");
                // Fetch related products
                fetchRelated(data[0]);
            } else {
                setProduct(null);
            }
            setLoading(false);
        }
        async function fetchRelated(prod) {
            const res = await fetch(`/api/admin/products`);
            const all = await res.json();
            const related = all.filter(p => p.category === prod.category && p._id !== prod._id).slice(0, 3);
            setRelated(related);
        }
        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-20 text-lg">Loading...</div>;
    }

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

    // Build PayPal products array for this product
    const paypalProducts = product ? [{
      title: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: 1,
      description: product.shortDescription || product.description || "",
    }] : [];

    // Animated add to cart handler
    const handleAddToCart = () => {
        setAnimating(true);
        addToCart(product);
        if (isMobile()) {
            const audio = new Audio(ADD_SOUND_URL);
            audio.play();
        }
        setTimeout(() => setAnimating(false), 700);
    };

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-12 pt-32">
                {/* Gallery */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mb-4 transition-transform duration-200 hover:scale-105 relative group">
                        {product?.featured && (
                            <span className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">Featured</span>
                        )}
                        <Image
                            src={mainImage}
                            alt={product.name}
                            width={600}
                            height={480}
                            className="w-full h-[26rem] object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                        />
                    </div>
                    <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                        {product.images && product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`border-2 rounded-lg w-20 h-20 overflow-hidden transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 ${mainImage === img ? 'border-green-600 ring-2 ring-green-400' : 'border-gray-200 hover:border-green-400'}`}
                                aria-label={`Show image ${idx + 1}`}
                            >
                                <Image src={img} alt={product.name} width={80} height={80} className="object-cover w-full h-full" />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <Star size={18} className="text-yellow-400" />
                        <span className="font-semibold text-gray-700">4.8</span>
                        <span className="text-gray-400">(1,245 reviews)</span>
                        <CheckCircle size={18} className="text-green-500 ml-2" />
                        <span className="text-green-700 font-semibold">Trusted Seller</span>
                    </div>
                    {/* Product Description */}
                    <div className="w-full mt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Product Description</h2>
                        <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                    </div>
                    {/* Related Products - Desktop Only */}
                    {related.length > 0 && (
                        <div className="w-full mt-6 hidden md:block">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {related.map((rel) => (
                                    <Link key={rel._id} href={`/products/${rel._id}`} className="block hover:bg-gray-50 rounded-lg transition overflow-hidden group">
                                        <div className="overflow-hidden">
                                            <img
                                                src={rel.mainImage}
                                                alt={rel.name}
                                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-base font-bold text-gray-700 group-hover:text-green-700 transition">{rel.name}</h3>
                                            <div className="text-green-700 font-semibold text-base mt-1">${rel.price?.toLocaleString()}</div>
                                            <p className="text-gray-500 mt-1 text-xs line-clamp-2">{rel.shortDescription || rel.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Info & Purchase */}
                <div className="md:w-1/2 flex flex-col gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight flex items-center gap-2">{product.name}</h1>
                        <p className="text-gray-700 mt-4 text-left w-full max-w-lg font-medium text-lg">{product.shortDescription}</p>
                        <div className="flex items-center gap-3 mt-4 mb-2">
                            <span className="text-3xl font-bold text-green-600">${product.price?.toLocaleString()}</span>
                            <span className="text-base font-medium text-gray-500">Tax included.</span>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">In Stock</span>
                        </div>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex flex-col gap-3">
                        <AddToCartButton animating={animating} onAdd={handleAddToCart} />
                        <Link href="/cart">
                            <button className="w-full py-3 bg-white border border-gray-400 text-black rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400">
                                Go to Cart
                            </button>
                        </Link>
                        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onClick={handleStripeCheckout}
                        disabled={loadingStripe}
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M20.5 7.5h-17a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1Zm-17-2A3 3 0 0 0 .5 8.5v7a3 3 0 0 0 3 3h17a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-17Z"/><path fill="#fff" d="M7.5 12.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
                            Pay with Stripe
                        </button>
                        <div className="relative z-0">
                          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '', currency: 'USD', intent: 'capture' }}>
                              <PayPalButton
                                  amount={product?.price || 0}
                                  products={paypalProducts}
                                  onSuccess={({ details, orderId }) => {
                                    const idStr = orderId && orderId.toString ? orderId.toString() : orderId;
                                    window.location.href = `/order-success?order_id=${idStr}`;
                                  }}
                                  onError={err => setPaypalError(err)}
                              />
                          </PayPalScriptProvider>
                        </div>
                        {paypalSuccess && (
                          <div className="mb-2 text-center text-green-700 font-semibold">PayPal payment successful!</div>
                        )}
                        {paypalError && (
                          <div className="mb-2 text-center text-red-600 font-semibold">{paypalError}</div>
                        )}
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1 border border-gray-200">
                        <div className="flex items-center gap-2"><Tag size={16} className="text-green-600" /><span className="font-semibold">Category:</span> {product.category}</div>
                        <div className="flex items-center gap-2"><Package size={16} className="text-green-600" /><span className="font-semibold">Brand:</span> {product.brand || "N/A"}</div>
                        
                    </div>
                    
                    {/* Collapsible Details */}
                    <div className="mt-6">
                        <button
                            className="flex items-center gap-2 text-green-700 font-semibold text-base focus:outline-none"
                            onClick={() => setShowDetails(v => !v)}
                        >
                            <Info size={18} />
                            Product Details
                            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {showDetails && (
                            <div className="mt-3 text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
                              

                                
                                <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                                    <div><Truck size={14} className="inline mr-1" /> Fast delivery in 2-4 days</div>
                                    <div><CheckCircle size={14} className="inline mr-1" /> 30-day return policy</div>
                                </div>
                                
                            </div>
                        )}
                        
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                        Project Management, Delivery and Consultancy<br />
                        For more information, contact us at <a href="mailto:info@trendhive.com" className="text-green-600 underline">info@trendhive.com</a>
                    </div>
                </div>
            </div>


            {/* Related Products - Mobile Only */}
            {related.length > 0 && (
                <div className="block md:hidden max-w-7xl mx-auto px-4 mt-10 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {related.map((rel) => (
                            <Link key={rel._id} href={`/products/${rel._id}`} className="block hover:bg-gray-50 rounded-lg transition overflow-hidden group">
                                <div className="overflow-hidden">
                                    <img
                                        src={rel.mainImage}
                                        alt={rel.name}
                                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="text-base font-bold text-gray-700 group-hover:text-green-700 transition">{rel.name}</h3>
                                    <div className="text-green-700 font-semibold text-base mt-1">${rel.price?.toLocaleString()}</div>
                                    <p className="text-gray-500 mt-1 text-xs line-clamp-2">{rel.shortDescription || rel.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <Footer/>
        </>
    );
}

function AddToCartButton({ animating, onAdd }) {
    return (
        <button
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500
                ${animating ? "bg-green-600 scale-105 animate-pulse" : "bg-black hover:bg-green-700"}`}
            onClick={onAdd}
            disabled={animating}
            style={{ position: "relative" }}
        >
            <span className={`transition-transform duration-300 ${animating ? "scale-125 rotate-12" : ""}`}>
                <ShoppingCart size={22} />
            </span>
            {animating ? "Added!" : "Add To Cart"}
        </button>
    );
}
