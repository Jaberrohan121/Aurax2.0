
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ICONS } from '../constants';

interface ChatBoxProps {
  senderId: string;
  receiverId: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderId, receiverId, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      text: input,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const visibleMessages = messages.filter(m => 
    (m.senderId === senderId && (m.receiverId === receiverId || receiverId === 'any')) || 
    (m.receiverId === senderId && (m.senderId === receiverId || senderId === 'admin'))
  );

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {visibleMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-2">
            {ICONS.Chat}
            <p className="text-sm">Start a conversation...</p>
          </div>
        )}
        {visibleMessages.map(msg => {
          const isMine = msg.senderId === senderId;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                isMine 
                  ? 'bg-amber-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border rounded-tl-none border-gray-100'
              }`}>
                {msg.text}
                <p className={`text-[9px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <button 
          onClick={handleSend}
          className="bg-amber-600 text-white p-3 rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-100"
        >
          {ICONS.ArrowRight}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
