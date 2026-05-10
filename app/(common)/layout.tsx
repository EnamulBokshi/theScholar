import Header from '@/components/header'
import React from 'react'

export default function CommonLayout({children}: {children: React.ReactNode}) {
  return (
   <>
    <Header />
    {children}
   </>
  )
}
