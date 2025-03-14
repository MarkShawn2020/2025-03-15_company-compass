import axios from 'axios';
import {
    BochaSearchResult,
    InvestmentRecommendation,
    QccCompanyDetail,
    QccCompanySearchResult
} from '../models/types';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

const bochaClient = axios.create({
  baseURL: 'https://api.bochaai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOCHA_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

const deepseekClient = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// 企查查企业高级搜索API
export async function searchCompany(query: string): Promise<QccCompanySearchResult[]> {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // 开发时使用模拟数据
      return mockSearchCompany(query);
    }
    
    // 调用我们的代理API路由
    const response = await apiClient.get('/qcc/search', { 
      params: { query }
    });
    
    // 检查API响应状态
    if (response.data.Status !== '200') {
      throw new Error(`API错误: ${response.data.Message}`);
    }
    
    // 转换为应用所需的数据格式
    return (response.data.Result || []).map((item: any) => ({
      Name: item.Name,
      KeyNo: item.KeyNo,
      CreditCode: item.CreditCode,
      OperName: item.OperName,
      Address: item.Address,
      StartDate: item.StartDate,
      RegCapital: item.RegistCapi,
      Status: item.Status
    }));
  } catch (error) {
    console.error('搜索公司失败:', error);
    // 如果是开发环境但模拟数据标志未设置，则返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为备选');
      return mockSearchCompany(query);
    }
    throw new Error('搜索公司时发生错误');
  }
}

// 企查查企业信息核验API
export async function getCompanyDetail(keyNo: string): Promise<QccCompanyDetail> {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // 开发时使用模拟数据
      return mockGetCompanyDetail(keyNo);
    }
    
    // 调用我们的代理API路由
    const response = await apiClient.get('/qcc/detail', { 
      params: { keyNo }
    });
    
    // 检查API响应状态
    if (response.data.Status !== '200') {
      throw new Error(`API错误: ${response.data.Message}`);
    }
    
    // 假设返回的数据格式与示例中的一致
    const data = response.data.Result.Data;
    
    // 转换为应用所需的数据格式
    return {
      KeyNo: data.KeyNo,
      Name: data.Name,
      CreditCode: data.CreditCode,
      OperName: data.OperName,
      Status: data.Status,
      StartDate: data.StartDate,
      RegistCapi: data.RegistCapi,
      RegisteredCapital: data.RegisteredCapital,
      RegisteredCapitalUnit: data.RegisteredCapitalUnit,
      RegisteredCapitalCCY: data.RegisteredCapitalCCY,
      Address: data.Address,
      Scope: data.Scope,
      ContactInfo: data.ContactInfo
    };
  } catch (error) {
    console.error('获取公司详情失败:', error);
    // 如果是开发环境但模拟数据标志未设置，则返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为备选');
      return mockGetCompanyDetail(keyNo);
    }
    throw new Error('获取公司详情时发生错误');
  }
}

// 博查网络搜索API
export async function webSearch(query: string): Promise<BochaSearchResult[]> {
  try {
    // 模拟API响应，实际项目中需要替换为真实API调用
    // const response = await bochaClient.post('/web-search', {
    //   query: query,
    //   freshness: "noLimit",
    //   summary: true,
    //   count: 10
    // });
    // return response.data.data.webPages.value;
    
    // 开发时的模拟数据
    return mockWebSearch(query);
  } catch (error) {
    console.error('网络搜索失败:', error);
    throw new Error('网络搜索时发生错误');
  }
}

// DeepSeek API生成投资建议书
export async function generateInvestmentRecommendation(
  companyDetail: QccCompanyDetail,
  webSearchResults: BochaSearchResult[]
): Promise<InvestmentRecommendation> {
  try {
    // 构建输入数据
    const inputData = {
      companyInfo: companyDetail,
      webSearchInfo: webSearchResults
    };
    
    // 模拟API响应，实际项目中需要替换为真实API调用
    // const response = await deepseekClient.post('/v1/chat/completions', {
    //   model: "deepseek-chat",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "你是一个专业的投资分析师，需要基于提供的公司信息和网络搜索结果，生成一份全面的投资建议书。"
    //     },
    //     {
    //       role: "user",
    //       content: JSON.stringify(inputData)
    //     }
    //   ],
    //   response_format: {
    //     type: "json_object"
    //   }
    // });
    // 
    // return JSON.parse(response.data.choices[0].message.content);
    
    // 开发时的模拟数据
    return mockGenerateInvestmentRecommendation(companyDetail, webSearchResults);
  } catch (error) {
    console.error('生成投资建议书失败:', error);
    throw new Error('生成投资建议书时发生错误');
  }
}

// 模拟数据，用于开发测试

function mockSearchCompany(query: string): QccCompanySearchResult[] {
  // 模拟搜索结果
  return [
    {
      Name: `${query}科技有限公司`,
      KeyNo: "abc123",
      CreditCode: "91110111MA01C8JT4A",
      OperName: "张三",
      Address: "北京市海淀区西土城路10号",
      StartDate: "2018-05-15",
      RegCapital: "1000万",
      Status: "在业"
    },
    {
      Name: `${query}信息技术有限公司`,
      KeyNo: "def456",
      CreditCode: "91110111MA01C8JT4B",
      OperName: "李四",
      Address: "北京市朝阳区建国路88号",
      StartDate: "2015-08-22",
      RegCapital: "500万",
      Status: "在业"
    }
  ];
}

function mockGetCompanyDetail(keyNo: string): QccCompanyDetail {
  // 模拟公司详情
  return {
    KeyNo: keyNo,
    Name: "模拟科技有限公司",
    CreditCode: "91110111MA01C8JT4A",
    OperName: "张三",
    Status: "存续（在营、开业、在册）",
    StartDate: "2018-05-15",
    RegistCapi: "1000万元",
    RegisteredCapital: "1000",
    RegisteredCapitalUnit: "万",
    RegisteredCapitalCCY: "CNY",
    Address: "北京市海淀区西土城路10号",
    Scope: "技术开发；货物进出口、技术进出口；销售通讯设备、计算机软件及辅助设备",
    ContactInfo: {
      WebSiteList: ["https://www.example.com"],
      Email: "contact@example.com",
      Tel: "010-12345678"
    }
  };
}

function mockWebSearch(query: string): BochaSearchResult[] {
  // 模拟网络搜索结果
  return [
    {
      name: `${query}科技有限公司完成A轮融资`,
      url: "https://news.example.com/article1",
      snippet: `${query}科技有限公司宣布完成5000万元人民币A轮融资，由XXX资本领投。`,
      summary: `${query}科技有限公司于2023年6月完成5000万元人民币A轮融资，由XXX资本领投，YYY资本跟投。公司主要业务为企业级SaaS服务，目前已有超过100家企业客户。`,
      siteName: "科技新闻网",
      dateLastCrawled: "2023-07-01"
    },
    {
      name: `${query}科技CEO专访：谈技术创新与未来发展`,
      url: "https://blog.example.com/interview",
      snippet: `${query}科技CEO张三分享了公司的核心技术和未来发展规划。`,
      summary: `在这次专访中，${query}科技CEO张三介绍了公司的核心AI技术，以及在企业服务领域的创新应用。他表示，公司计划在明年拓展海外市场，并推出新的数据分析产品线。`,
      siteName: "科技博客",
      dateLastCrawled: "2023-08-15"
    }
  ];
}

function mockGenerateInvestmentRecommendation(
  companyDetail: QccCompanyDetail,
  webSearchResults: BochaSearchResult[]
): InvestmentRecommendation {
  // 模拟生成的投资建议书
  return {
    companyBasicInfo: {
      name: companyDetail.Name,
      creditCode: companyDetail.CreditCode,
      establishDate: companyDetail.StartDate,
      registeredCapital: companyDetail.RegistCapi,
      businessScope: companyDetail.Scope,
      address: companyDetail.Address
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
  };
} 