# 投资尽调报告生成器

基于Next.js构建的投资尽调报告自动生成系统，通过整合企业信息和网络数据，利用AI技术快速生成专业的投资建议书。

## 项目概述

投资尽调报告生成器是一个帮助投资人、分析师和咨询顾问快速生成专业投资尽调报告的工具。只需输入目标公司名称，系统会自动收集公司信息、网络数据，并利用DeepSeek AI技术生成全面的投资分析报告。

整个流程从数小时缩短至几分钟，大幅提高了投资分析的效率，让分析师将精力集中在价值判断而非数据收集和报告撰写上。

## 功能特点

- **公司信息检索**：通过企查查数据源获取公司基本信息、法人代表、注册资本、经营范围等信息
- **网络数据爬取**：自动搜索并整合互联网上关于目标公司的新闻、融资信息和业务动态
- **AI生成报告**：利用DeepSeek大语言模型，分析各项数据，生成专业的投资建议书
- **多维度分析**：包含公司基本情况、团队背景、产品技术、商业模式、市场分析和投资建议等多个维度
- **报告编辑**：提供在线编辑界面，用户可根据需要修改和完善AI生成的内容
- **多格式导出**：支持将最终报告导出为PDF或Word格式，方便分享和打印
- **数据持久化**：利用本地存储保存中间数据，支持分步骤完成报告生成

## 系统工作流程

1. **公司搜索**：输入目标公司名称，从企查查数据库中搜索并选择目标企业
2. **公司信息**：获取详细的公司注册信息、经营状况、法人信息等基础数据
3. **网络搜索**：自动进行网络搜索，收集公司相关的新闻、融资信息和业务动态
4. **生成建议书**：AI分析企业数据和网络信息，自动生成专业的投资建议书
5. **查看与编辑**：查看AI生成的内容，根据需要进行修改和完善
6. **导出报告**：将最终报告导出为PDF或Word格式，方便分享和存档

## 技术栈

- **前端框架**：[Next.js](https://nextjs.org/) + [React](https://reactjs.org/)
- **UI组件**：[Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **状态管理**：[Jotai](https://jotai.org/)
- **API通信**：[Axios](https://axios-http.com/)
- **AI集成**：[DeepSeek API](https://www.deepseek.com/)
- **数据源**：企查查API、博查网络搜索API（开发环境使用模拟数据）
- **文档生成**：PDF和Word格式导出

## 安装和使用

### 本地开发环境

1. 克隆仓库
```bash
git clone https://github.com/yourusername/investment-due-diligence
cd investment-due-diligence
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
创建`.env.local`文件并添加以下配置：
```
# 开发环境使用模拟数据（设置为true则使用模拟数据）
NEXT_PUBLIC_USE_MOCK_DATA=true
# DeepSeek API密钥（如果不使用模拟数据则必须提供）
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
# 企查查API密钥（如果不使用模拟数据则必须提供）
NEXT_PUBLIC_QCC_API_KEY=your_qcc_api_key
```

4. 启动开发服务器
```bash
pnpm dev
```

5. 访问应用
打开浏览器访问 [http://localhost:3000/investment-due-diligence](http://localhost:3000/investment-due-diligence)

### 生产环境部署

1. 构建应用
```bash
pnpm build
```

2. 启动生产服务器
```bash
pnpm start
```

## 生产环境配置

在生产环境中，您需要设置以下环境变量：

1. `NEXT_PUBLIC_USE_MOCK_DATA=false` - 确保使用真实API
2. `NEXT_PUBLIC_DEEPSEEK_API_KEY` - DeepSeek API密钥
3. `NEXT_PUBLIC_QCC_API_KEY` - 企查查API密钥

## 数据源说明

本项目可以集成以下数据源：

1. **企查查API**：提供企业工商信息、法人代表、注册资本等基础数据
2. **博查搜索API**：获取互联网上关于目标公司的新闻、文章和报道
3. **DeepSeek API**：AI大模型，用于生成分析报告

为方便开发和测试，系统内置了模拟数据功能，可以在不配置实际API密钥的情况下进行开发和测试。

## 未来计划

- 整合更多企业数据源，如专利数据、融资数据、财务报表等
- 提供更多报告模板和自定义选项
- 添加团队协作功能，支持多人编辑和版本管理
- 增加数据可视化功能，生成图表和分析图形
- 加入竞品分析功能，提供行业对比和竞争格局分析

## 许可证

[MIT](LICENSE)
