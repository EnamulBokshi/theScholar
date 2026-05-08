'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Trash2,
  Menu,
  X,
  Phone,
  Mic,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VoiceChat from '@/components/voice-chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  loading?: boolean;
}

function ChatPageContent() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Load chats from localStorage on mount and check for URL param
  useEffect(() => {
    const savedChats = localStorage.getItem('scholarChats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      
      // Check if there's a chat ID in the URL
      const urlChatId = searchParams.get('id');
      if (urlChatId && parsedChats.find((c: Chat) => c.id === urlChatId)) {
        setCurrentChatId(urlChatId);
        
        // Check if this chat needs AI response
        const targetChat = parsedChats.find((c: Chat) => c.id === urlChatId);
        if (targetChat && targetChat.loading && targetChat.messages.length === 1) {
          // Fetch AI response
          fetchAIResponse(urlChatId, targetChat.messages[0].content);
        }
      } else if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    }
  }, [searchParams]);

  // Fetch AI response for a chat
  const fetchAIResponse = async (chatId: string, userMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }

      // Update chat with AI response
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: 'assistant', content: data.response },
                ],
                loading: false,
              }
            : chat
        )
      );
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get response from The Scholar';
      setError(errorMessage);
      
      // Remove loading flag even on error
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, loading: false } : chat
        )
      );
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('scholarChats', JSON.stringify(chats));
    }
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === currentChatId);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setError(null);
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId) {
      setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
    if (updatedChats.length === 0) {
      localStorage.removeItem('scholarChats');
    }
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title } : chat
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    let chatId = currentChatId;

    // Create new chat if none exists
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
      };
      setChats([newChat, ...chats]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    const userMessage = prompt.trim();
    setPrompt('');
    setError(null);

    // Add user message to current chat
    const currentChat = chats.find((chat) => chat.id === chatId);
    const updatedMessages = [
      ...(currentChat?.messages || []),
      { role: 'user' as const, content: userMessage },
    ];

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
      )
    );

    // Update chat title with first message
    if (!currentChat || currentChat.messages.length === 0) {
      updateChatTitle(chatId, userMessage);
    }

    setIsLoading(true);
    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: updatedMessages.slice(0, -1),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }

      // Add assistant response to chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...updatedMessages,
                  { role: 'assistant', content: data.response },
                ],
              }
            : chat
        )
      );
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get response from The Scholar';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = getCurrentChat();

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-card border-r border-border overflow-hidden flex flex-col`}
      >
        <div className='p-4 border-b border-border'>
          <button
            onClick={createNewChat}
            className='w-full flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity'
          >
            <Plus className='w-5 h-5' />
            <span className='font-medium'>New Chat</span>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-2'>
          {chats.length === 0 ? (
            <div className='text-center text-muted-foreground text-sm py-8'>
              No chats yet. Start a new conversation!
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-muted'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <MessageSquare className='w-4 h-4 shrink-0 text-muted-foreground' />
                <span className='flex-1 text-sm truncate'>{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className='opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity'
                >
                  <Trash2 className='w-4 h-4 text-destructive' />
                </button>
              </div>
            ))
          )}
        </div>

        <div className='p-4 border-t border-border text-xs text-muted-foreground'>
          <p>The Scholar</p>
          <p className='mt-1'>Ask questions about any religion</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='h-14 border-b border-border flex items-center px-4 gap-3'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='p-2 hover:bg-muted rounded-lg transition-colors'
          >
            {sidebarOpen ? (
              <X className='w-5 h-5' />
            ) : (
              <Menu className='w-5 h-5' />
            )}
          </button>
          <h1 className='text-lg font-semibold flex-1'>
            {currentChat?.title || 'The Scholar'}
          </h1>
          <button
            onClick={() => setShowVoiceChat(true)}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity'
            title='Start Voice Conversation'
          >
            {/* <Phone className='w-4 h-4' /> */}
            <Mic className='w-4 h-4' />
            <span className='hidden sm:inline'>Talk </span>
          </button>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto'>
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center p-8 text-center'>
              <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                <MessageSquare className='w-8 h-8 text-primary' />
              </div>
              <h2 className='text-2xl font-bold mb-2'>
                As-salamu alaykum!
              </h2>
              <p className='text-muted-foreground max-w-md'>
                Welcome to The Scholar. Ask questions about any religion,
                scripture, history, practice, or belief.
              </p>
            </div>
          ) : (
            <div className='max-w-4xl mx-auto px-4 py-6'>
              {currentChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-6 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className='text-xs font-semibold mb-2 opacity-70'>
                      {message.role === 'user' ? 'You' : 'The Scholar'}
                    </div>
                    {message.role === 'assistant' ? (
                      <div className='prose prose-sm dark:prose-invert max-w-none'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className='whitespace-pre-wrap wrap-break-word'>
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='mb-6 flex justify-start'>
                  <div className='max-w-[80%] rounded-xl p-4 bg-muted text-foreground'>
                    <div className='text-xs font-semibold mb-2 opacity-70'>
                      The Scholar
                    </div>
                    <div className='flex items-center gap-2'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className='mx-4 mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm'>
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className='border-t border-border p-4'>
          <form onSubmit={handleSubmit} className='max-w-4xl mx-auto'>
            <div className='relative'>
              <input
                type='text'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Ask The Scholar anything about religion...'
                disabled={isLoading}
                className='w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              />
              <button
            onClick={() => setShowVoiceChat(true)}
            className='absolute right-12 cursor-pointer text-black/50 hover:text-violet-400 top-1/2 -translate-y-1/2 p-2 rounded-lg  hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            title='Start Voice Conversation'
          >
            {/* <Phone className='w-4 h-4' /> */}
            <Mic className='w-4 h-4' />
            {/* <span className='hidden sm:inline'>Talk </span> */}
          </button>
              <button
                type='submit'
                disabled={isLoading || !prompt.trim()}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  <Send className='w-5 h-5' />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <VoiceChat onClose={() => setShowVoiceChat(false)} />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className='flex h-screen items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <p className='text-muted-foreground'>Loading chat...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
