/**
 * 投资尽调报告生成器路由配置
 */

export const investmentDueDiligenceRoutes = {
  home: '/investment-due-diligence',
  
  // 共享报告访问路径，用于分享功能
  sharedReport: (key: string) => `/shared-report/${key}`, 
} 