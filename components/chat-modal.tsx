'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-end justify-end p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose()
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 w-full max-w-md h-[75vh] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                Live Chat
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            <iframe
              src="https://real-time-chat-weld.vercel.app/"
              className="w-full h-full border-none"
              allow="clipboard-write; microphone; camera"
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}