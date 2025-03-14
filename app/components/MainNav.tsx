'use client'

import { Button } from '@/components/ui/button'
import { FileSearch, Home, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { UserMenu } from './UserMenu'

export function MainNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || 
           (path !== '/' && pathname.startsWith(path))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* <FileSearch className="h-6 w-6 text-orange-500" /> */}
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="text-lg font-bold">投资尽调报告生成器</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 mr-4">
            <Link href="/" passHref>
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                <span>首页</span>
              </Button>
            </Link>
            
            <Link href="/investment-due-diligence" passHref>
              <Button 
                variant={isActive('/investment-due-diligence') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-1"
              >
                <FileSearch className="h-4 w-4" />
                <span>生成报告</span>
              </Button>
            </Link>
            
            <Link href="/investment-due-diligence/debug" passHref>
              <Button 
                variant={isActive('/investment-due-diligence/debug') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                <span>API调试</span>
              </Button>
            </Link>
          </nav>
          
          {/* 用户菜单 */}
          <Suspense fallback={<div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  )
} 