module.exports = {
  title: '自然醒的博客',
  description: ' ',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?681a9f14f2db8e622747ef03c33bb367";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `]
  ],
  theme: 'reco',
  themeConfig: {
    search: true,
    type: 'blog',
    lastUpdated: '更新时间',
    nav: [
      {
        text: '首页',
        link: '/',
        icon: 'reco-home'
      },
      { 
        text: '时间轴',
        link: '/timeline/',
        icon: 'reco-date'
      },
      { 
        text: '自我介绍',
        link: '/about/',
        icon: 'reco-account'
      },
    ]
  }
}
