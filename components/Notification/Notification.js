"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function NotificationModal({ isOpen, setIsOpen, type, message }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        {/* Background Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-50"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="relative w-full max-w-sm bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center text-center">
              {/* ✅ Centered Success or Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="flex flex-col items-center justify-center"
              >
                {type === "success" ? (
                  <CheckCircleIcon className="w-16 h-16 text-green-500" />
                ) : (
                  <XCircleIcon className="w-16 h-16 text-red-500" />
                )}
                {/* ✅ Centered Message */}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">{message}</h3>
              </motion.div>

              {/* ✅ Centered Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md"
              >
                Close
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
