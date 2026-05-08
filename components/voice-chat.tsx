'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Loader2, Volume2 } from 'lucide-react';
import { UltravoxSession } from 'ultravox-client';

interface VoiceChatProps {
  onClose?: () => void;
}

export default function VoiceChat({ onClose }: VoiceChatProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<UltravoxSession | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (sessionRef.current) {
        sessionRef.current.leaveCall();
      }
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const startVoiceCall = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get join URL from our API
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to create voice session');
      }

      const data = await response.json();
      
      // Create Ultravox session
      const session = new UltravoxSession();
      sessionRef.current = session;

      // Set up event listeners
      session.addEventListener('status', (event: any) => {
        console.log('Session status event:', event);
        const status = event.state || event.status || event;
        console.log('Parsed status:', status);
        
        if (status === 'connected' || status === 'idle') {
          console.log('Setting connected to true');
          setIsConnected(true);
          setIsConnecting(false);
        } else if (status === 'disconnected' || status === 'disconnecting') {
          console.log('Setting disconnected');
          setIsConnected(false);
          setIsConnecting(false);
        } else if (status === 'connecting') {
          console.log('Still connecting');
          setIsConnecting(true);
          setIsConnected(false);
        }
      });

      session.addEventListener('transcripts', (event: any) => {
        const transcripts = event.transcripts || [];
        const newTranscripts = transcripts.map((t: any) => 
          `${t.speaker === 'user' ? 'You' : 'The Scholar'}: ${t.text}`
        );
        setTranscript(newTranscripts);
      });

      session.addEventListener('error', (event: any) => {
        console.error('Session error:', event);
        setError('Voice session error occurred');
        setIsConnecting(false);
        setIsConnected(false);
      });

      // Join the call
      await session.joinCall(data.joinUrl);
      
      // Fallback: If status event doesn't fire, set connected after a short delay
      setTimeout(() => {
        if (sessionRef.current && !isConnected) {
          console.log('Fallback: Setting connected state');
          setIsConnected(true);
          setIsConnecting(false);
        }
      }, 2000);

    } catch (err: any) {
      console.error('Failed to start voice call:', err);
      setError(err.message || 'Failed to start voice conversation');
      setIsConnecting(false);
    }
  };

  const endVoiceCall = () => {
    if (sessionRef.current) {
      sessionRef.current.leaveCall();
      sessionRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setTranscript([]);
  };

  const toggleMute = () => {
    if (sessionRef.current) {
      const sessionAny = sessionRef.current as any;

      // Prefer an explicit API if provided by UltravoxSession
      if (typeof sessionAny.setMuted === 'function') {
        sessionAny.setMuted(!isMuted);
      } else if (typeof sessionAny.mute === 'function' || typeof sessionAny.unmute === 'function') {
        if (!isMuted && typeof sessionAny.mute === 'function') {
          sessionAny.mute();
        } else if (isMuted && typeof sessionAny.unmute === 'function') {
          sessionAny.unmute();
        }
      } else if ('isMuted' in sessionAny) {
        // fallback if the property actually exists at runtime
        sessionAny.isMuted = !isMuted;
      } else {
        // No mute API available; just update local UI state and warn
        console.warn('UltravoxSession does not expose a mute API');
      }

      setIsMuted(!isMuted);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='bg-linear-to-r from-primary to-primary/80 p-6 text-primary-foreground'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
                <Volume2 className='w-6 h-6' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Voice Conversation</h2>
                <p className='text-sm opacity-90'>
                  {isConnected
                    ? 'Connected - Speak freely'
                    : isConnecting
                    ? 'Connecting...'
                    : 'Ready to start'}
                </p>
              </div>
            </div>
            {isConnected && (
              <div className='flex items-center gap-2'>
                <span className='w-3 h-3 bg-green-400 rounded-full animate-pulse' />
                <span className='text-sm'>Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {error && (
            <div className='mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm'>
              {error}
            </div>
          )}

          {/* Transcript */}
          {transcript.length > 0 && (
            <div className='mb-6 max-h-64 overflow-y-auto p-4 bg-muted/50 rounded-lg space-y-2'>
              {transcript.map((text, index) => (
                <div
                  key={index}
                  className={`text-sm ${
                    text.startsWith('You:')
                      ? 'text-primary font-medium'
                      : 'text-foreground'
                  }`}
                >
                  {text}
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          )}

          {/* Instructions */}
          {!isConnected && !isConnecting && (
            <div className='mb-6 p-4 bg-muted/50 rounded-lg'>
              <h3 className='font-semibold mb-2'>How it works:</h3>
              <ul className='text-sm text-muted-foreground space-y-1'>
                <li>• Click "Start Call" to begin voice conversation</li>
                <li>• Speak naturally with the Scholar</li>
                <li>• Ask questions about any religion or tradition</li>
                <li>• Use the mute button if needed</li>
                <li>• End call when finished</li>
              </ul>
            </div>
          )}

          {/* Controls */}
          <div className='flex items-center justify-center gap-4'>
            {!isConnected && !isConnecting && (
              <button
                onClick={startVoiceCall}
                className='flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity font-medium'
              >
                <Phone className='w-5 h-5' />
                Start Call
              </button>
            )}

            {isConnecting && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Loader2 className='w-5 h-5 animate-spin' />
                <span>Connecting...</span>
              </div>
            )}

            {isConnected && (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-colors ${
                    isMuted
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <MicOff className='w-6 h-6' />
                  ) : (
                    <Mic className='w-6 h-6' />
                  )}
                </button>

                <button
                  onClick={endVoiceCall}
                  className='p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors'
                  title='End Call'
                >
                  <PhoneOff className='w-6 h-6' />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>
            The Scholar is here to provide balanced, respectful, and accurate information about world religions through voice conversation. Ask any questions you have about faiths, practices, histories, or beliefs, and the Scholar will do its best to provide clear and thoughtful answers.
          </p>
          <button
            onClick={onClose}
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
