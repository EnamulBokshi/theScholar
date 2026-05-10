'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Mic, Send, Loader2, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import VoiceChat from './voice-chat';

export default function PromptSection() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt.trim();

    // Create new chat with initial message (no AI response yet)
    const newChat = {
      id: Date.now().toString(),
      title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
      messages: [{ role: 'user', content: userMessage }],
      createdAt: Date.now(),
      loading: true, // Mark as loading
    };

    // Save to localStorage
    const existingChats = localStorage.getItem('scholarChats');
    const chats = existingChats ? JSON.parse(existingChats) : [];
    chats.unshift(newChat);
    localStorage.setItem('scholarChats', JSON.stringify(chats));

    // Redirect immediately to chat page
    router.push(`/chat?id=${newChat.id}`);
  };
  const startVoiceInput = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setPrompt(prompt + (prompt ? ' ' : '') + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.log('[v0] Speech recognition error:', event.error);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const religiousPrompts = [
    'What are the core beliefs of Christianity?',
    'How do Buddhism and Hinduism differ?',
    'What is the role of scripture in Judaism?',
    'What are the main branches of Christianity?',
    'What are the similarities between major world religions?',
    'How do religions approach prayer and meditation?',
    'What is the history of religious debate and interpretation?',
    'How do different religions understand morality?',
  ];

  

  return (
    <section className='w-full py-16 md:py-24 px-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight'>
            Ask any religious question
          </h1>
          <p className='text-lg text-muted-foreground'>
            Explore faith, tradition, and meaning with The Scholar
          </p>
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='relative'>
            <input
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ask The Scholar anything...'
              disabled={isLoading}
              className='w-full px-6 py-4 pr-24 rounded-2xl bg-card border border-border/40 shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            />
            <button
              type='button'
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isLoading}
              className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic className='w-5 h-5' />
            </button>
            <button
              type='submit'
              disabled={isLoading || !prompt.trim()}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                <Send className='w-5 h-5' />
              )}
            </button>
          </div>

          {isListening && (
            <div className='flex items-center gap-2 px-2 text-sm text-red-600'>
              <span className='inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse'></span>
              Listening...
            </div>
          )}
        </form>

        {/* Religious Question Shortcuts */}
        <div className='mt-12 flex flex-wrap items-center justify-center gap-2'>
          {religiousPrompts.map((question, index) => (
            <button
              key={index}
              onClick={() => setPrompt(question)}
              disabled={isLoading}
              className='px-4 py-2 rounded-full text-sm border border-border/40 hover:border-accent/50 hover:bg-accent/8 transition-all text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {question}
            </button>
          ))}
        </div>

        {/* Voice Call Button */}
        <div className='mt-12 text-center'>
          <button
            onClick={() => setShowVoiceChat(true)}
            className='inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold'
          >
            <Phone className='w-5 h-5' />
            Start Voice Conversation
          </button>
          <p className='mt-2 text-xs text-muted-foreground'>
            Talk directly with the Scholar for a more interactive experience. Ask questions about any religion or spiritual tradition and get thoughtful answers through voice conversation.
          </p>
        </div>
      </div>

      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <VoiceChat onClose={() => setShowVoiceChat(false)} />
      )}
    </section>
  );
}
