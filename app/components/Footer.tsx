import { Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto w-full border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            {/* <FileText className="h-5 w-5 text-orange-500" /> */}
            <Image src="/logo.png" alt="logo" width={24} height={24} />
            <span className="text-sm font-medium">投资尽调报告生成器</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/investment-due-diligence"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              开始使用
            </Link>
            <Link 
              href="/investment-due-diligence/debug"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              API调试
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} 投资尽调报告生成器
          </div>
        </div>
      </div>
    </footer>
  )
} 