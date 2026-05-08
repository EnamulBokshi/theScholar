'use client';

import React, { JSX } from 'react';
import {
  Globe,
  BookOpen,
  Scale,
  CalendarDays,
  CheckCircle,
  Link2,
  UserRound,
  Puzzle,
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'document' | 'website' | 'slides';
  icon: JSX.Element;
}

const contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Biographical Explorer',
    category: 'Comparative Religion',
    type: 'website',
    icon: <UserRound className='w-8 h-8' />,
  },
  {
    id: '2',
    title: 'Content Analyzer',
    category: 'Knowledge Tools',
    type: 'website',
    icon: <Puzzle className='w-8 h-8' />,
  },
  {
    id: '3',
    title: 'Scripture Map',
    category: 'Sacred Texts',
    type: 'website',
    icon: <Link2 className='w-8 h-8' />,
  },
  {
    id: '4',
    title: 'Text Explorer',
    category: 'Sacred Texts',
    type: 'website',
    icon: <BookOpen className='w-8 h-8' />,
  },
  {
    id: '5',
    title: 'Knowledge Web',
    category: 'Research',
    type: 'website',
    icon: <Globe className='w-8 h-8' />,
  },
  {
    id: '6',
    title: 'Source Checker',
    category: 'Research',
    type: 'website',
    icon: <CheckCircle className='w-8 h-8' />,
  },
  {
    id: '7',
    title: 'Practice Guide',
    category: 'Ritual and Ethics',
    type: 'website',
    icon: <CalendarDays className='w-8 h-8' />,
  },
  {
    id: '8',
    title: 'Tradition Navigator',
    category: 'Philosophy and Law',
    type: 'website',
    icon: <Scale className='w-8 h-8' />,
  },
];

export default function ContentGrid() {
  return (
    <section className='w-full py-16 px-4 bg-background'>
      <div className='max-w-7xl mx-auto'>
        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-3 mb-10'>
          {[
            'All',
            'Comparative Religion',
            'Sacred Texts',
            'Research',
            'Ritual and Ethics',
          ].map((category) => (
            <button
              key={category}
              className='px-6 py-2.5 rounded-full text-sm border border-border text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium'
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {contentItems.map((item) => (
            <div
              key={item.id}
              className='group p-12 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between'
            >
              <div className='flex flex-col items-center text-center space-y-4'>
                <div className='text-primary bg-primary/10 p-5 rounded-full'>
                  {item.icon}
                </div>
                <h3 className='text-xl font-semibold text-foreground group-hover:text-primary transition-colors'>
                  {item.title}
                </h3>
                <p className='text-sm text-muted-foreground'>{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More */}
        <div className='mt-16 text-center'>
          <button className='text-primary hover:text-primary/80 transition-colors font-semibold text-lg'>
            Explore More Features →
          </button>
        </div>
      </div>
    </section>
  );
}
