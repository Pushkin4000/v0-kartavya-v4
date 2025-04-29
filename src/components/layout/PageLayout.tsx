
import React from 'react';
import PageHeader from './PageHeader';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  hideHeader?: boolean;
}

export default function PageLayout({
  children,
  className,
  containerClassName,
  hideHeader = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <PageHeader />}
      <main className={cn("flex-1", className)}>
        <div className={cn("container mx-auto px-4 py-8", containerClassName)}>
          {children}
        </div>
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="font-heading font-bold text-lg text-kartavya-dark">
              Kartavya
            </div>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kartavya Food Redistribution Platform. 
            Connecting food providers with NGOs to reduce waste and fight hunger.
          </p>
        </div>
      </footer>
    </div>
  );
}
