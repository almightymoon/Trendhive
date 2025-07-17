// components/ProtectedRoute.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/Contexts/SessionContext";
import NotificationModal from "@/components/Notification/Notification";

export default function ProtectedRoute({ children }) {
  const { token, checkTokenValidity } = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!checkTokenValidity()) {
      setModalOpen(true);
      setModalMessage("Your session has expired. Please sign in again.");
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  }, [token, checkTokenValidity, router]);

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