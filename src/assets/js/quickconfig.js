// 快捷键默认选项
/**
 * 层级关系 按键值: { 页面组件路径: [{name: 执行事件名, method: 执行事件方法, params: 参数}] }
 * **/
let quickBtn = {
  'enter': {
    'imagebase/ImageBase': [
      {
        name: '查询',
        method: 'getImageBase',
        params: true
      }
    ],
    'productbase/ProductBase': [
      {
        name: '查询',
        method: 'getProduct',
        params: true
      }
    ],
    'articlebase/ArticleBase': [
      {
        name: '查询',
        method: 'getArticleBase',
        params: true
      }
    ],
    'sitebase/SiteBase': [
      {
        name: '查询',
        method: 'getSiteBase',
        params: true
      }
    ]
  }
}

export default quickBtn
