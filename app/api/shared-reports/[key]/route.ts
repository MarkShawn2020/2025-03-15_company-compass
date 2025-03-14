import { NextRequest, NextResponse } from 'next/server'

/**
 * 获取共享报告API
 * 根据唯一标识符(key)获取共享报告数据
 */
export async function GET(
  request: NextRequest,
  context: { params: { key: string } }
) {
  try {
    const { key } = context.params
    
    // 在实际应用中，这里应该从数据库获取共享报告数据
    // 例如：const report = await db.reports.findUnique({ where: { id: key } })
    
    // 现在我们使用模拟数据进行演示
    // 在实际项目中，您需要替换为真实的数据获取逻辑
    
    // 模拟从数据库查询
    const mockReport = {
      id: key,
      companyBasicInfo: {
        name: "示例科技有限公司",
        creditCode: "91110111MA01C8JT4A",
        establishDate: "2018-05-15",
        registeredCapital: "1000万元",
        address: "北京市海淀区西土城路10号",
        businessScope: "技术开发；货物进出口、技术进出口；销售通讯设备、计算机软件及辅助设备"
      },
      teamInfo: {
        coreMembers: "张三（CEO）：清华大学计算机博士，前XXX公司技术总监\n李四（CTO）：斯坦福大学人工智能硕士，拥有多项专利",
        background: "创始团队拥有丰富的技术和行业经验，在人工智能领域有深厚的研究背景",
        experience: "管理团队曾成功创办过两家科技企业，并有丰富的企业级服务经验"
      },
      productAndTechnology: {
        mainProducts: "1. 企业智能决策系统\n2. 数据分析平台\n3. 行业专用AI解决方案",
        technologyAdvantage: "自主研发的机器学习算法，在数据处理效率上比行业平均水平提高30%",
        patents: "拥有5项核心技术专利，3项软件著作权"
      },
      businessModel: {
        revenueStream: "主要通过SaaS服务订阅模式获取收入，辅以定制化解决方案服务",
        customers: "目前已服务超过100家中大型企业客户，包括金融、制造、零售等多个行业",
        competitiveAdvantage: "技术领先、产品体验优秀、客户服务及时，客户续约率达95%"
      },
      marketAnalysis: {
        industrySize: "企业级SaaS市场规模2023年达到2000亿元，年增长率25%",
        growth: "未来5年，预计复合增长率将保持在20%以上",
        maturity: "行业处于快速发展期，国内市场渗透率仍较低，有巨大发展空间",
        competition: "目前有3-5家主要竞争对手，但各家在细分领域侧重点不同"
      },
      investmentSuggestion: {
        financingPlan: "计划在12个月内完成B轮融资，融资金额1亿元人民币",
        valuationAnalysis: "基于当前营收和增长率，估值区间为5-7亿元人民币",
        risks: "技术迭代风险、市场竞争加剧风险、人才流失风险",
        opportunities: "产业数字化转型加速、政策支持、国产替代趋势",
        recommendation: "建议投资，看好公司在企业服务领域的长期发展潜力。投资者可考虑参与下一轮融资，建议投资额不超过3000万元。"
      }
    }
    
    // 如果在实际应用中找不到报告，返回404
    // if (!report) {
    //   return NextResponse.json({ error: '报告未找到' }, { status: 404 })
    // }
    
    return NextResponse.json(mockReport)
  } catch (error) {
    console.error('获取共享报告失败:', error)
    return NextResponse.json(
      { error: '服务器错误，无法获取报告' }, 
      { status: 500 }
    )
  }
} 