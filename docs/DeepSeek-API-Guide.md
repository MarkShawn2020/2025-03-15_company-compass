# DeepSeek API 集成指南

本文档提供了有关如何在我们的投资尽调报告生成器项目中集成和使用DeepSeek API的详细说明。

## 什么是DeepSeek API？

[DeepSeek](https://deepseek.com/) 是一个强大的AI平台，提供了先进的大语言模型服务。在我们的项目中，我们使用DeepSeek API来生成高质量的投资建议书，该API能够：

- 分析企业数据和网络搜索结果
- 生成专业的投资分析报告
- 提供JSON格式的结构化输出
- 确保内容的准确性和可读性

## 设置DeepSeek API

### 1. 获取API密钥

1. 访问 [DeepSeek平台官网](https://platform.deepseek.com/)
2. 注册一个账户并登录
3. 导航到API密钥管理页面
4. 创建一个新的API密钥
5. 复制生成的API密钥

### 2. 配置环境变量

将API密钥添加到项目的环境变量中：

1. 打开项目根目录下的`.env.local`文件
2. 找到`NEXT_PUBLIC_DEEPSEEK_API_KEY`变量
3. 将其值设置为您的DeepSeek API密钥：

```
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_actual_api_key_here
```

4. 将`NEXT_PUBLIC_USE_MOCK_DATA`设置为`false`以启用真实API调用：

```
NEXT_PUBLIC_USE_MOCK_DATA=false
```

5. 保存文件

## 使用DeepSeek API生成投资建议书

我们的应用程序已经集成了DeepSeek API，用于在"生成建议书"步骤中自动生成投资建议书。当用户点击"生成投资建议书"按钮时，系统会：

1. 收集公司基本信息和网络搜索结果
2. 将这些数据发送到DeepSeek API
3. 使用DeepSeek的先进AI模型分析数据
4. 生成结构化的投资建议书
5. 呈现结果供用户查看和编辑

## 技术实现细节

### API请求格式

我们向DeepSeek API发送的请求如下：

```javascript
const response = await deepseekClient.post('/v1/chat/completions', {
  model: "deepseek-chat",
  messages: [
    {
      role: "system",
      content: systemPrompt  // 包含详细指示的系统提示
    },
    {
      role: "user",
      content: `请根据以下公司信息和网络搜索结果，生成一份JSON格式的投资建议书：\n\n${JSON.stringify(inputData, null, 2)}`
    }
  ],
  response_format: {
    type: "json_object"  // 指定返回JSON格式
  },
  max_tokens: 4000,      // 足够的输出长度
  temperature: 0.2       // 低温度以获得确定性输出
});
```

### 系统提示词设计

我们使用精心设计的系统提示词，指导DeepSeek模型生成高质量的投资建议书：

```javascript
const systemPrompt = `你是一位专业的投资分析师，精通企业尽职调查和投资评估。
请基于提供的公司信息和网络搜索结果，生成一份全面、专业且客观的投资建议书。

请注意以下要求：
1. 分析内容必须基于提供的事实数据，避免编造或添加虚构内容
2. 使用专业的金融和投资术语，但确保内容通俗易懂
3. 分析要客观中立，同时指出风险与机会
4. 对公司的竞争优势和劣势要有深入分析
5. 对市场前景和估值逻辑要有合理论证
6. 最终给出清晰的投资建议

你的输出必须是有效的JSON格式，结构应与示例一致。`;
```

### 输出格式

DeepSeek API返回的投资建议书是JSON格式的，包含以下主要部分：

1. **公司基本信息**：名称、注册资本、经营范围等
2. **团队信息**：核心成员、背景、经验
3. **产品与技术**：主要产品、技术优势、专利情况
4. **商业模式**：收入来源、客户群体、竞争优势
5. **市场分析**：行业规模、增长趋势、竞争格局
6. **投资建议**：融资计划、估值分析、风险与机会、投资建议

## 故障排除

### 常见问题

1. **API调用失败**：
   - 检查API密钥是否正确
   - 确认网络连接正常
   - 查看DeepSeek平台的服务状态

2. **输出内容不完整**：
   - 增加`max_tokens`参数值
   - 减少输入数据的大小
   - 简化系统提示词

3. **内容质量问题**：
   - 调整`temperature`参数
   - 改进系统提示词
   - 提供更多相关的输入数据

### 模拟数据模式

在开发或测试过程中，或者当DeepSeek API不可用时，您可以启用模拟数据模式：

```
NEXT_PUBLIC_USE_MOCK_DATA=true
```

这将使用预定义的模拟数据生成投资建议书，而不是实际调用API。

## API费用与限制

DeepSeek API是一个付费服务，根据使用量收费。请参阅[DeepSeek官方定价页面](https://platform.deepseek.com/pricing)了解最新的价格信息和使用限制。

---

如有任何问题或需要进一步的帮助，请联系项目维护人员。 