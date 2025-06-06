'use client'

import { useState } from 'react'
import ChatModal from './chat-modal'

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-400 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        💬
      </button>
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}