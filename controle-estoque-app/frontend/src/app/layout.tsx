
'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/providers/ToastProvider';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="pt-BR">
      <head>
        <title>Controle de Estoque Náutico</title>
        <meta name="description" content="Sistema completo de controle de estoque" />
      </head>
      <body className={clsx(inter.className, 'antialiased flex')}>
        <ToastProvider />
        
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-64">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="p-4 md:p-6 lg:p-8 flex-1 bg-nautico-gray">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
