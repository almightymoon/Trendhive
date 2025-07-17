// components/ProtectedRoute.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/Contexts/SessionContext";
import NotificationModal from "@/components/Notification/Notification";
import { notFound } from "next/navigation";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, checkTokenValidity, admin } = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    console.log("ProtectedRoute: token", token);
    console.log("ProtectedRoute: checkTokenValidity()", checkTokenValidity());
    if (!checkTokenValidity()) {
      setModalOpen(true);
      setModalMessage("Your session has expired. Please sign in again.");
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  }, [token, checkTokenValidity, router]);

  if (checkTokenValidity() && adminOnly && admin !== 1) {
    notFound();
    return null;
  }

  return (
    <>
      {modalOpen && (
        <NotificationModal
          isOpen={modalOpen}
          message={modalMessage}
          onClose={() => setModalOpen(false)}
        />
      )}
      {checkTokenValidity() ? children : null}
    </>
  );
}