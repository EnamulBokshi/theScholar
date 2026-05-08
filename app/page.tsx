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
        <PromptSection />

        {/* Content Grid Section */}
        <ContentGrid />
      </main>
    </div>
  );
}
