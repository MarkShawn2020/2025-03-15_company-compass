import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { Footer } from './components/Footer';
import { MainNav } from './components/MainNav';
import './globals.css';

export const metadata: Metadata = {
  title: '投资尽调报告生成器',
  description: '基于企业信息和AI技术的专业投资尽调报告智能生成系统',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="zh-CN"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-gray-50 flex flex-col" suppressHydrationWarning>
        <UserProvider userPromise={userPromise}>
          <MainNav />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
