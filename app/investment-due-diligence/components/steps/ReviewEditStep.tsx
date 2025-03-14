'use client'

import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import {
    Textarea
} from '@/components/ui/textarea'
import { useAtom } from 'jotai'
import {
    ArrowRight,
    BarChart3,
    Building,
    DollarSign,
    Edit3,
    Lightbulb,
    ShoppingBag,
    User
} from 'lucide-react'
import { useState } from 'react'

import {
    InvestmentRecommendation,
    WorkflowStep
} from '../../models/types'
import {
    currentStepAtom,
    investmentRecommendationAtom
} from '../../stores/investmentStore'

export function ReviewEditStep() {
  // Jotai 状态
  const [recommendation, setRecommendation] = useAtom(investmentRecommendationAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  
  // 本地状态
  const [editableRecommendation, setEditableRecommendation] = useState<InvestmentRecommendation | null>(recommendation)
  const [activeTab, setActiveTab] = useState('company')
  const [isEditing, setIsEditing] = useState(false)

  // 进入下一步
  const handleNext = () => {
    // 保存编辑的内容到全局状态
    if (editableRecommendation) {
      setRecommendation(editableRecommendation)
    }
    setCurrentStep(WorkflowStep.EXPORT)
  }

  // 处理编辑
  const handleEdit = () => {
    setIsEditing(true)
  }

  // 处理保存
  const handleSave = () => {
    setIsEditing(false)
    // 保存编辑的内容到全局状态
    if (editableRecommendation) {
      setRecommendation(editableRecommendation)
    }
  }

  // 更新编辑内容
  const updateContent = (section: keyof InvestmentRecommendation, field: string, value: string) => {
    if (!editableRecommendation) return

    setEditableRecommendation({
      ...editableRecommendation,
      [section]: {
        ...editableRecommendation[section],
        [field]: value
      }
    })
  }

  if (!recommendation || !editableRecommendation) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">请先生成投资建议书</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">投资建议书预览与编辑</h3>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            编辑内容
          </Button>
        ) : (
          <Button onClick={handleSave} variant="default" size="sm">
            保存修改
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="company" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">公司基本情况</span>
            <span className="sm:hidden">公司</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">团队简介</span>
            <span className="sm:hidden">团队</span>
          </TabsTrigger>
          <TabsTrigger value="product" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">产品与技术</span>
            <span className="sm:hidden">产品</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">业务模式</span>
            <span className="sm:hidden">业务</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">市场分析</span>
            <span className="sm:hidden">市场</span>
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">投资建议</span>
            <span className="sm:hidden">投资</span>
          </TabsTrigger>
        </TabsList>
        
        {/* 公司基本情况 */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>公司基本情况</CardTitle>
              <CardDescription>公司名称、注册信息、地址等基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">公司名称</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.name} 
                      onChange={(e) => updateContent('companyBasicInfo', 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">统一社会信用代码</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.creditCode} 
                      onChange={(e) => updateContent('companyBasicInfo', 'creditCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">成立日期</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.establishDate} 
                      onChange={(e) => updateContent('companyBasicInfo', 'establishDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">注册资本</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.registeredCapital} 
                      onChange={(e) => updateContent('companyBasicInfo', 'registeredCapital', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">经营范围</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.businessScope} 
                      onChange={(e) => updateContent('companyBasicInfo', 'businessScope', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">注册地址</label>
                    <Textarea 
                      value={editableRecommendation.companyBasicInfo.address} 
                      onChange={(e) => updateContent('companyBasicInfo', 'address', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">公司名称</p>
                    <p>{editableRecommendation.companyBasicInfo.name}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">统一社会信用代码</p>
                    <p>{editableRecommendation.companyBasicInfo.creditCode}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">成立日期</p>
                    <p>{editableRecommendation.companyBasicInfo.establishDate}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">注册资本</p>
                    <p>{editableRecommendation.companyBasicInfo.registeredCapital}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">经营范围</p>
                    <p className="whitespace-pre-line">{editableRecommendation.companyBasicInfo.businessScope}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">注册地址</p>
                    <p>{editableRecommendation.companyBasicInfo.address}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 团队简介 */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>团队简介</CardTitle>
              <CardDescription>创始团队成员、背景经验等信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">核心成员</label>
                    <Textarea 
                      value={editableRecommendation.teamInfo.coreMembers} 
                      onChange={(e) => updateContent('teamInfo', 'coreMembers', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">团队背景</label>
                    <Textarea 
                      value={editableRecommendation.teamInfo.background} 
                      onChange={(e) => updateContent('teamInfo', 'background', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">相关经验</label>
                    <Textarea 
                      value={editableRecommendation.teamInfo.experience} 
                      onChange={(e) => updateContent('teamInfo', 'experience', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">核心成员</p>
                    <p className="whitespace-pre-line">{editableRecommendation.teamInfo.coreMembers}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">团队背景</p>
                    <p>{editableRecommendation.teamInfo.background}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">相关经验</p>
                    <p>{editableRecommendation.teamInfo.experience}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 产品与技术 */}
        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>产品与技术</CardTitle>
              <CardDescription>公司主要产品、技术优势与专利情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">主要产品</label>
                    <Textarea 
                      value={editableRecommendation.productAndTechnology.mainProducts} 
                      onChange={(e) => updateContent('productAndTechnology', 'mainProducts', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">技术优势</label>
                    <Textarea 
                      value={editableRecommendation.productAndTechnology.technologyAdvantage} 
                      onChange={(e) => updateContent('productAndTechnology', 'technologyAdvantage', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">专利情况</label>
                    <Textarea 
                      value={editableRecommendation.productAndTechnology.patents} 
                      onChange={(e) => updateContent('productAndTechnology', 'patents', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">主要产品</p>
                    <p className="whitespace-pre-line">{editableRecommendation.productAndTechnology.mainProducts}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">技术优势</p>
                    <p>{editableRecommendation.productAndTechnology.technologyAdvantage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">专利情况</p>
                    <p>{editableRecommendation.productAndTechnology.patents}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 更多标签内容类似，省略其余标签的内容... */}
        
        {/* 业务模式 */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>业务模式</CardTitle>
              <CardDescription>公司的业务模式、客户情况与竞争优势</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">收入来源</label>
                    <Textarea 
                      value={editableRecommendation.businessModel.revenueStream} 
                      onChange={(e) => updateContent('businessModel', 'revenueStream', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">客户情况</label>
                    <Textarea 
                      value={editableRecommendation.businessModel.customers} 
                      onChange={(e) => updateContent('businessModel', 'customers', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">竞争优势</label>
                    <Textarea 
                      value={editableRecommendation.businessModel.competitiveAdvantage} 
                      onChange={(e) => updateContent('businessModel', 'competitiveAdvantage', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">收入来源</p>
                    <p>{editableRecommendation.businessModel.revenueStream}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">客户情况</p>
                    <p>{editableRecommendation.businessModel.customers}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">竞争优势</p>
                    <p>{editableRecommendation.businessModel.competitiveAdvantage}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 市场分析 */}
        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>市场分析</CardTitle>
              <CardDescription>行业规模、成长性、成熟度与竞争格局</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">行业规模</label>
                    <Textarea 
                      value={editableRecommendation.marketAnalysis.industrySize} 
                      onChange={(e) => updateContent('marketAnalysis', 'industrySize', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">成长性</label>
                    <Textarea 
                      value={editableRecommendation.marketAnalysis.growth} 
                      onChange={(e) => updateContent('marketAnalysis', 'growth', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">成熟度</label>
                    <Textarea 
                      value={editableRecommendation.marketAnalysis.maturity} 
                      onChange={(e) => updateContent('marketAnalysis', 'maturity', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">竞争格局</label>
                    <Textarea 
                      value={editableRecommendation.marketAnalysis.competition} 
                      onChange={(e) => updateContent('marketAnalysis', 'competition', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">行业规模</p>
                    <p>{editableRecommendation.marketAnalysis.industrySize}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">成长性</p>
                    <p>{editableRecommendation.marketAnalysis.growth}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">成熟度</p>
                    <p>{editableRecommendation.marketAnalysis.maturity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">竞争格局</p>
                    <p>{editableRecommendation.marketAnalysis.competition}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 投资建议 */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>投资建议</CardTitle>
              <CardDescription>融资计划、估值分析、风险与机会</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium">融资计划</label>
                    <Textarea 
                      value={editableRecommendation.investmentSuggestion.financingPlan} 
                      onChange={(e) => updateContent('investmentSuggestion', 'financingPlan', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">估值分析</label>
                    <Textarea 
                      value={editableRecommendation.investmentSuggestion.valuationAnalysis} 
                      onChange={(e) => updateContent('investmentSuggestion', 'valuationAnalysis', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">风险</label>
                    <Textarea 
                      value={editableRecommendation.investmentSuggestion.risks} 
                      onChange={(e) => updateContent('investmentSuggestion', 'risks', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">机会</label>
                    <Textarea 
                      value={editableRecommendation.investmentSuggestion.opportunities} 
                      onChange={(e) => updateContent('investmentSuggestion', 'opportunities', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">建议</label>
                    <Textarea 
                      value={editableRecommendation.investmentSuggestion.recommendation} 
                      onChange={(e) => updateContent('investmentSuggestion', 'recommendation', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">融资计划</p>
                    <p>{editableRecommendation.investmentSuggestion.financingPlan}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">估值分析</p>
                    <p>{editableRecommendation.investmentSuggestion.valuationAnalysis}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">风险</p>
                    <p>{editableRecommendation.investmentSuggestion.risks}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium text-muted-foreground">机会</p>
                    <p>{editableRecommendation.investmentSuggestion.opportunities}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">建议</p>
                    <p>{editableRecommendation.investmentSuggestion.recommendation}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleNext}>
          继续
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 