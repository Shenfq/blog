export default {
  theme: 'blog',
  title: '自然醒的博客',
  description: '前端工程师@拼多多，爱折腾，擅长 JavaScript，欢迎关注我的公众号「更了不起的前端」',
  srcDir: 'blog',
  plugins: ['blog'],
  blog: {
    root: '/posts/',
    author: 'shenfq',
    social: {
      github: 'Shenfq',
      email: 'shenfq95@foxmail.com',
    },
  },
  nav: [
    {
      text: '首页',
      link: '/',
      icon: 'czs-home-l',
    },
    {
      text: '分类',
      link: '/categories/',
      icon: 'czs-category-l',
    },
    {
      text: '标签',
      link: '/tags/',
      icon: 'czs-tag-l',
    },
    {
      text: '关于',
      link: '/about/',
      icon: 'czs-about-l',
    },
    {
      text: '归档',
      link: '/archives/',
      icon: 'czs-box-l',
    },
    {
      text: '友情链接',
      link: '/links/index.html',
      icon: 'czs-link-l',
    },
  ],
};