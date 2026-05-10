'use client';

import Header from '@/components/header';
import ContentGrid from '@/components/content-grid';
import PromptSection from '@/components/prompt-section';

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='w-full'>
        {/* Hero Section with Prompt */}
        <div className='relative overflow-hidden'>
          <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(86,182,198,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(138,203,208,0.08),transparent_32%)]' />
          <PromptSection />
        </div>

        {/* Content Grid Section */}
        <ContentGrid />
      </main>
    </div>
  );
}
