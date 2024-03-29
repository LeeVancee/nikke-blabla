import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import BtnBox from '@/components/BtnBox';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  icons: {
    icon: '/logo.png', // /public path
  },
  title: 'Nikke Blabla',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
        <div className="app">
          {/* <BtnBox /> */}
          {children}
        </div>
      </body>
    </html>
  );
}
