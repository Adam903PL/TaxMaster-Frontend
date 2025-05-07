'use client';

import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <main>
        {children}
      </main>
    </div>
  );
}
