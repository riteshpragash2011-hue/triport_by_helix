"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 px-5 py-4 rounded-sm shadow-xl max-w-sm w-full border animate-in slide-in-from-bottom-4 ${
        type === "success"
          ? "bg-white border-gold/40 text-neutral-900"
          : "bg-white border-red-200 text-neutral-900"
      }`}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
          type === "success" ? "bg-gold/10" : "bg-red-50"
        }`}
      >
        {type === "success" ? (
          <svg
            className="w-3 h-3 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed flex-1">{message}</p>

      {/* Close button */}
      <button
        onClick={onClose}
        className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5"
        aria-label="Dismiss notification"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
