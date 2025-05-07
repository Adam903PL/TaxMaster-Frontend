'use client';

import FloatingNavbar from '@/components/NavBar';
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <main>
        <FloatingNavbar/>
        {children}
      </main>
    </div>
  );
}
