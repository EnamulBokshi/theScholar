'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Trash2,
  Menu,
  X,
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
  createdAt: number | string;
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
  const router = useRouter();

  // Load chats from DB and fallback to localStorage on mount
  useEffect(() => {
    const loadChats = async () => {
      // 1. Try fetching from DB
      try {
        const response = await fetch('/api/chats');
        if (response.ok) {
          const dbChats = await response.json();
          if (dbChats.length > 0) {
            setChats(dbChats.map((c: any) => ({
              ...c,
              messages: [], // Messages will be fetched on selection
              createdAt: new Date(c.createdAt).getTime()
            })));
            
            const urlChatId = searchParams.get('id');
            if (urlChatId) {
              setCurrentChatId(urlChatId);
              fetchChatHistory(urlChatId);
            } else {
              setCurrentChatId(dbChats[0].id);
              fetchChatHistory(dbChats[0].id);
            }
            return; // Successfully loaded from DB
          }
        }
      } catch (err) {
        console.error("DB load failed, falling back to localStorage", err);
      }

      // 2. Fallback to localStorage if DB is empty or failed
      const savedChats = localStorage.getItem('scholarChats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        const urlChatId = searchParams.get('id');
        if (urlChatId && parsedChats.find((c: Chat) => c.id === urlChatId)) {
          setCurrentChatId(urlChatId);
        } else if (parsedChats.length > 0) {
          setCurrentChatId(parsedChats[0].id);
        }
      }
    };

    loadChats();
  }, [searchParams]);

  const fetchChatHistory = async (chatId: string) => {
    // Only fetch if it's likely a DB ID (not a timestamp from localStorage)
    if (chatId.length < 15) return; 

    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const fullChat = await response.json();
        setChats(prev => prev.map(c => 
          c.id === chatId ? { ...c, messages: fullChat.messages } : c
        ));
      }
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

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
          chatId: chatId.length > 15 ? chatId : undefined, // Only send if it's a DB ID
          conversationHistory: [], // Server will fetch from DB if chatId is provided
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
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, loading: false } : chat
        )
      );
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

  const createNewChat = async () => {
    // Try to create in DB first
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      });
      if (response.ok) {
        const newChat = await response.json();
        const formattedChat: Chat = {
          id: newChat.id,
          title: newChat.title,
          messages: [],
          createdAt: new Date(newChat.createdAt).getTime()
        };
        setChats([formattedChat, ...chats]);
        setCurrentChatId(newChat.id);
        setError(null);
        return;
      }
    } catch (err) {
      console.error("DB chat creation failed, using local only", err);
    }

    // Fallback to local
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

  const deleteChat = async (chatId: string) => {
    // Try delete from DB
    if (chatId.length > 15) {
      try {
        await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
      } catch (err) {
        console.error("Failed to delete chat from DB", err);
      }
    }

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
      await createNewChat();
      // Refetch chatId after creation (local state is updated in createNewChat)
      // Note: setChats is async, but we can't easily wait for it.
      // So we'll just handle it in a way that respects the current logic.
      return; 
    }

    const userMessage = prompt.trim();
    setPrompt('');
    setError(null);

    // Add user message to current chat
    const currentChat = chats.find((chat) => chat.id === chatId);
    const updatedMessages: Message[] = [
      ...(currentChat?.messages || []),
      { role: 'user', content: userMessage },
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
          chatId: chatId.length > 15 ? chatId : undefined,
          conversationHistory: chatId.length > 15 ? [] : updatedMessages.slice(0, -1),
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
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = getCurrentChat();

  return (
    <div className='flex h-[calc(100vh-64px)] bg-background overflow-hidden relative'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } border-r border-border bg-card transition-all duration-300 flex flex-col overflow-hidden absolute lg:relative z-20 h-full`}
      >
        <div className='p-4 border-b border-border'>
          <button
            onClick={createNewChat}
            className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium'
          >
            <Plus className='w-4 h-4' />
            <span>New Chat</span>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-2'>
          {chats.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground px-4'>
              <p className='text-sm italic font-medium'>No chats yet.</p>
              <p className='text-xs mt-1'>
                Start a conversation to see your history here.
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 p-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => {
                  setCurrentChatId(chat.id);
                  if (chat.messages.length === 0) fetchChatHistory(chat.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              >
                <MessageSquare className='w-4 h-4 shrink-0' />
                <span className='text-sm truncate flex-1'>{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className='opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all'
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
              {error && (
                <div className='mb-6 flex justify-center'>
                  <div className='bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg border border-destructive/20'>
                    {error}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className='p-4 border-t border-border'>
          <form
            onSubmit={handleSubmit}
            className='max-w-4xl mx-auto relative flex items-center gap-2'
          >
            <input
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ask about religion, scriptures, history...'
              className='flex-1 bg-muted border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all pr-12'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={isLoading || !prompt.trim()}
              className='absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                <Send className='w-5 h-5' />
              )}
            </button>
          </form>
          <p className='text-[10px] text-center mt-2 text-muted-foreground'>
            AI responses can vary. Please consult primary sources and scholars
            for critical matters.
          </p>
        </div>
      </div>

      {/* Voice Chat Component */}
      {showVoiceChat && (
        <VoiceChat onClose={() => setShowVoiceChat(false)} />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
