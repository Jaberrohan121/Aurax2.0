
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface ChatBoxProps {
  senderId: string;
  receiverId: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderId, receiverId, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = { id: Math.random().toString(36).substr(2, 9), senderId, receiverId, text: input, timestamp: Date.now() };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.senderId === senderId ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-gray-50 p-3 rounded-xl outline-none" placeholder="Type a message..." />
        <button onClick={handleSend} className="bg-amber-600 text-white p-3 rounded-xl">{ICONS.ArrowRight}</button>
      </div>
    </div>
  );
};

export default ChatBox;
