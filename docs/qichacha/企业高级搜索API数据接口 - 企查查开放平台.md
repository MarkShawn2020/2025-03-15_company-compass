---
title: 企业高级搜索API数据接口 - 企查查开放平台
source: https://openapi.qcc.com/dataApi/886
---

企业高级搜索API数据接口 - 企查查开放平台
===============
     

![Image 1: logo](https://openapi.qcc.com/_nuxt/img/be85b18.png)

![Image 2](https://openapi.qcc.com/_nuxt/img/ac43c23.png)

![Image 3](https://openapi.qcc.com/_nuxt/img/12c6c2d.png)

[API](https://openapi.qcc.com/data)

[企业户](https://openapi.qcc.com/operation/generalize)

[离线数据库](https://openapi.qcc.com/offlineDatabase)

[业务场景](https://openapi.qcc.com/businessScenario)

[余额充值](https://openapi.qcc.com/recharge)

登录 | 注册

[](https://openapi.qcc.com/data)[API](https://openapi.qcc.com/data)

/ [所有API](https://openapi.qcc.com/dataApi) / [企业高级搜索](https://openapi.qcc.com/dataApi/886)

所有API 166

工商信息 31

法律诉讼 34

经营风险 19

经营信息 16

企业发展 5

知识产权 7

历史信息 31

增值服务 10

全球企业 4

特色推荐 9

企业高级搜索
======

![Image 4: 消息](https://openapi.qcc.com/_nuxt/img/b0c5fe8.png)

0.10元/次

在线咨询

*   限企业实名用户使用
*   本接口需提供应用场景审核

ApiCode：886 申请开通 接口已开通

描述：通过搜索关键字（如企业名、人名、产品名、地址、电话、经营范围等）获取匹配搜索条件的企业列表信息，返回包括但不限于企业名称、法定代表人名称、企业状态、成立日期、统一社会信用代码、注册号等信息。

¥ 1,000.00

版本套餐：

*   免费试用20次
*   1,000.00 元/10000次
*   5,000.00 元/50000次
*   

您也可以通过 [余额充值](https://openapi.qcc.com/recharge) 进行扣费

加入购物车 立即购买

更多

*   企业高级搜索

接口地址： https://api.qichacha.com/FuzzySearch/GetList

支持格式： JSON

请求方式： GET

请求示例： https://api.qichacha.com/FuzzySearch/GetList?key=AppKey&searchKey=XXXXXX 调试API

请求参数(http请求头Headers)

*   名称 类型 是否必填 描述
*   Token String 是 验证加密值 Md5(key+Timespan+SecretKey) 加密的32位大写字符串) [请点击这里获取](javascript:void(0))
*   Timespan String 是 精确到秒的Unix时间戳

请求参数(Query)

*   名称 类型 是否必填 描述
*   key String 是 应用APPKEY(应用详细页查询)
*   searchKey String 是 搜索关键字（如企业名、人名、产品名、地址、电话、经营范围等）
*   provinceCode String 否 省份Code(6位行政区划代码)
*   cityCode String 否 城市Code(6位行政区划代码)
*   pageSize String 否 每页条数，默认为10，最大不超过20
*   pageIndex String 否 页码，默认第一页

返回参数(Return)

*   名称 类型 长度 描述
*   KeyNo String 100 主键
*   Name String 1000 企业名称
*   CreditCode String 50 统一社会信用代码，若查询企业为中国香港企业时：该字段返回商业登记号码
*   StartDate String 50 成立日期
*   OperName String 1000 法定代表人姓名
*   Status String 100 状态
*   No String 50 注册号，若查询企业为中国香港企业时：该字段返回企业编号
*   Address String 1000 注册地址

JSON返回示例

                        ```
{
    "Paging": {
        "PageSize": 1,
        "PageIndex": 1,
        "TotalRecords": 88
    },
    "Result": [
        {
            "KeyNo": "xxxxxxxxxxx",
            "Name": "xxxxxxx",
            "CreditCode": "xxxxxxxxxxx",
            "StartDate": "2012-07-10",
            "OperName": "xx",
            "Status": "存续",
            "No": "xxxxxxxxxxxxx",
            "Address": "xxxxxxxxxxxxxx室"
        }
    ],
    "Status": "200",
    "Message": "查询成功",
    "OrderNumber": "FUZZYSEARCH2021012016353715836099"
}
```
                      

复制

请求状态码

[请求状态码](https://openapi.qcc.com/services/after/status)

请求示例

[请求示例](https://openapi.qcc.com/services/after/code)

相关文档

(886)企业高级搜索.pdf

行政区划编码.xlsx

申请开通接口

提示

产品导航

[API](https://openapi.qcc.com/data)

[企业户](https://openapi.qcc.com/operation/generalize)

[离线数据库](https://openapi.qcc.com/offlineDatabase)

[SDK](https://openapi.qcc.com/SDK)

服务与支持

[售前支持](https://openapi.qcc.com/services/pre/guide)

[售后支持](https://openapi.qcc.com/services/after/test)

[数据字典](https://openapi.qcc.com/services/dict/countryCode)

[请求状态码](https://openapi.qcc.com/services/after/status)

[协议相关](https://openapi.qcc.com/services/protocol/tos)

[关于我们](https://openapi.qcc.com/services/aboutUs)

联系我们

电话咨询：400-088-8275

在线咨询：点击在线咨询

合作邮箱：[api@qcc.com](mailto:api@qcc.com "邮箱：api@qcc.com")

微信公众号

![Image 5](https://openapi.qcc.com/_nuxt/img/fc8c134.png)

友情链接： [企查查企业查询](https://www.qcc.com/) | [企查查专业版](https://pro.qichacha.com/?source=yjfoot) | [企查查国际版](https://www.qcckyc.com/?source=kfptfoot) | [企业产品中心](https://b.qcc.com/?source=kfptfoot)

© 2014-2025 [苏ICP备15042526号-5](https://beian.miit.gov.cn/ "苏ICP备15042526号-5") 版权所有 企查查科技股份有限公司 增值电信业务经营许可证：苏ICP证B2-20180251

电话

专业工程师答疑，快速解决您的问题

电话：

400-088-8275

微信

![Image 6](https://wework.qpic.cn/wwpic3az/136059_UWm2lh_jTdey0j-_1739500436/0) ![Image 7: qcc](https://openapi.qcc.com/img/qcc_icon.png)

微信扫码咨询

获取定制化解决方案

在线

咨询
