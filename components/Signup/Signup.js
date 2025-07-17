"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Bubbles from "../Bubble/Bubble";
import NotificationModal from "../Notification/Notification";
import { useSession } from "@/app/Contexts/SessionContext";

const authSchemas = {
  signup: z
    .object({
      name: z.string().min(1, "Name is required").max(50),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      // admin field removed, always default to member
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  login: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Prevents hydration issue
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();
  const { token, setToken, checkTokenValidity } = useSession();

  useEffect(() => {
    setIsMounted(true); // Ensures this only runs on the client
    if (!checkTokenValidity()) {
      // Token is invalid or expired
    }
  }, [checkTokenValidity]);

  const schema = isSignUp ? authSchemas.signup : authSchemas.login;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error);
      }

      setModalOpen(true);
      setModalType("success");
      setModalMessage(result.message);

      // Set userId in localStorage for cart persistence
      if (result.userId) {
        localStorage.setItem("userId", result.userId);
      } else if (result.user && result.user.id) {
        localStorage.setItem("userId", result.user.id);
      }

      if (!isSignUp) {
        setToken(result.token);
        localStorage.setItem("token", result.token);
      }

      setTimeout(() => {
        router.push("/");
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      setModalOpen(true);
      setModalType("error");
      setModalMessage(error.message);
    }
  };

  if (!isMounted) return null; // Prevents SSR mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Bubbles />

      {modalOpen && (
        <NotificationModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          type={modalType}
          message={modalMessage}
        />
      )}

      <div className="relative w-full max-w-5xl h-[600px] flex overflow-hidden shadow-2xl rounded-2xl">
        <motion.div
          initial={false}
          animate={{ x: isSignUp ? "100%" : "0%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 w-1/2 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-green-400 to-green-600 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            {isSignUp ? "Welcome Back!" : "Join Us!"}
          </h2>
          <p className="text-lg mb-6">
            {isSignUp
              ? "Sign in to your account."
              : "Create an account and get started."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSignUp(!isSignUp)}
            className="px-6 py-3 rounded-lg font-semibold bg-white text-green-600 shadow-md hover:shadow-lg transition-all"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </motion.button>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ x: isSignUp ? "0%" : "100%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 w-1/2 p-8 flex flex-col justify-center bg-white/80 backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name")}
                  className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-400 bg-gray-100"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-400 bg-gray-100"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-400 bg-gray-100"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {isSignUp && (
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-400 bg-gray-100"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}