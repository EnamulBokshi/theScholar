"use client";
import React from 'react';

export default function GoogleButton() {
  return (
    <div>
      <a href="/auth/google" className="inline-flex items-center gap-2 px-4 py-2 border rounded">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21.805 10.023h-9.78v3.954h5.599c-.24 1.56-1.73 4.576-5.599 4.576-3.365 0-6.102-2.768-6.102-6.175 0-3.407 2.737-6.175 6.102-6.175 1.915 0 3.196.815 3.93 1.512l2.675-2.58C17.37 3.085 15.03 2 12.026 2 6.94 2 2.92 6.016 2.92 11.1c0 5.084 4.02 9.1 9.107 9.1 8.246 0 9.778-6.096 9.778-9.177 0-.62-.07-1.097-.0 0z" fill="#4285F4" />
        </svg>
        Sign in with Google
      </a>
    </div>
  );
}
