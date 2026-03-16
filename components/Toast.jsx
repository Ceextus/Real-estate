"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { BsCheckCircleFill, BsXCircleFill, BsXLg } from "react-icons/bs";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-300 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-slide-in-up min-w-[280px] max-w-[400px] ${
              t.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {t.type === "success" ? (
              <BsCheckCircleFill className="text-green-500 text-xl shrink-0" />
            ) : (
              <BsXCircleFill className="text-red-500 text-xl shrink-0" />
            )}
            <p className="text-sm font-semibold flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <BsXLg size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
