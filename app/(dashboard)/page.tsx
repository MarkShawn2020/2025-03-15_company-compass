'use client'

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, FileSearch, FileText } from 'lucide-react';
import Link from 'next/link';
import { FallbackImage } from '../components/FallbackImage';

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                投资尽调报告
                <span className="block text-orange-500">智能生成系统</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                输入公司名称，一键生成专业的投资尽调报告。整合公司基本信息、团队背景、产品技术、商业模式和市场分析，
                帮助投资者做出更明智的决策。
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link href="/investment-due-diligence">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    开始生成报告
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="rounded-lg shadow-xl overflow-hidden">
                <FallbackImage 
                  src="/cover.png" 
                  alt="投资报告预览" 
                  className="w-full"
                  fallbackSrc="https://placehold.co/600x400/orange/white?text=投资报告预览"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <FileSearch className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  全面的企业信息
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  整合企查查等数据源，获取公司基本信息、法人代表、注册资本、
                  经营范围等关键数据，形成全面的企业画像。
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  AI生成投资建议
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  利用DeepSeek AI技术，分析企业数据和网络信息，自动生成
                  专业的投资分析报告，节省数小时的调研和写作时间。
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  专业报告导出
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  支持将生成的投资尽调报告导出为PDF或Word格式，
                  便于分享与打印，满足专业投资机构的文档需求。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                更高效的投资决策流程
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                传统的投资尽调流程耗时长、效率低，我们的AI系统能将数天的工作浓缩至几分钟，
                让您将更多精力放在价值判断和投资决策上，而非资料收集和报告撰写。
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <Link href="/investment-due-diligence">
                <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  立即体验
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">投资尽调流程</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              六步完成从公司搜索到投资报告生成的全流程
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  1
                </div>
                <h3 className="ml-3 text-lg font-medium">公司搜索</h3>
              </div>
              <p className="text-gray-500">输入目标公司名称，从企查查数据库中搜索并选择目标企业</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  2
                </div>
                <h3 className="ml-3 text-lg font-medium">公司信息</h3>
              </div>
              <p className="text-gray-500">获取详细的公司注册信息、经营状况、法人信息等基础数据</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  3
                </div>
                <h3 className="ml-3 text-lg font-medium">网络搜索</h3>
              </div>
              <p className="text-gray-500">系统自动进行网络搜索，收集公司相关的新闻、融资信息和业务动态</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  4
                </div>
                <h3 className="ml-3 text-lg font-medium">生成建议书</h3>
              </div>
              <p className="text-gray-500">AI分析搜集到的数据，自动生成包含多个维度的专业投资建议书</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  5
                </div>
                <h3 className="ml-3 text-lg font-medium">查看与编辑</h3>
              </div>
              <p className="text-gray-500">查看AI生成的报告内容，根据需要进行修改和完善</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  6
                </div>
                <h3 className="ml-3 text-lg font-medium">导出报告</h3>
              </div>
              <p className="text-gray-500">将最终报告导出为PDF或Word格式，方便分享和存档</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/investment-due-diligence">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                开始使用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
