import { AppWithTranslations } from '../../domain/entities/app';

export const apps: AppWithTranslations[] = [
  {
    id: '1',
    url: 'https://google.com',
    category: 'Productivity',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    order: 1,
    translations: {
      en: { name: 'Google', description: 'Search engine and services' },
      'zh-TW': { name: 'Google', description: '全球搜尋引擎與服務' },
      'zh-CN': { name: 'Google', description: '全球搜索引擎与服务' }
    },
    isGlobal: false,
  },
  {
    id: '2',
    url: 'https://github.com',
    category: 'Development',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg',
    order: 2,
    translations: {
      en: { name: 'GitHub', description: 'Code hosting and collaboration' },
      'zh-TW': { name: 'GitHub', description: '程式碼託管與協作' },
      'zh-CN': { name: 'GitHub', description: '代码托管与协作' }
    },
    isGlobal: false,
  },
  {
    id: '3',
    url: 'https://notion.so',
    category: 'Productivity',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    order: 3,
    translations: {
      en: { name: 'Notion', description: 'All-in-one workspace' },
      'zh-TW': { name: 'Notion', description: '多功能筆記與知識庫' },
      'zh-CN': { name: 'Notion', description: '多功能笔记与知识库' }
    },
    isGlobal: false,
  },
  {
    id: '4',
    url: 'https://mail.google.com',
    category: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    order: 4,
    translations: {
      en: { name: 'Gmail', description: 'Enterprise email service' },
      'zh-TW': { name: 'Gmail', description: '企業電子郵件服務' },
      'zh-CN': { name: 'Gmail', description: '企业电子邮件服务' }
    },
    isGlobal: false,
  },
  {
    id: '5',
    url: 'https://slack.com',
    category: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    order: 5,
    translations: {
      en: { name: 'Slack', description: 'Team communication' },
      'zh-TW': { name: 'Slack', description: '即時訊息與工作空間' },
      'zh-CN': { name: 'Slack', description: '即时消息与工作空间' }
    },
    isGlobal: false,
  },
  {
    id: '6',
    url: 'https://zoom.us',
    category: 'Communication',
    icon: 'https://www.google.com/s2/favicons?domain=zoom.us&sz=128',
    order: 6,
    translations: {
      en: { name: 'Zoom', description: 'Video conferencing' },
      'zh-TW': { name: 'Zoom', description: '視訊會議與線上協作' },
      'zh-CN': { name: 'Zoom', description: '视频会议与在线协作' }
    },
    isGlobal: false,
  },
  {
    id: '7',
    url: 'https://trello.com',
    category: 'Productivity',
    icon: 'https://www.google.com/s2/favicons?domain=trello.com&sz=128',
    order: 7,
    translations: {
      en: { name: 'Trello', description: 'Project management' },
      'zh-TW': { name: 'Trello', description: '視覺化看板專案管理' },
      'zh-CN': { name: 'Trello', description: '可视化看板项目管理' }
    },
    isGlobal: false,
  },
  {
    id: '8',
    url: 'https://spotify.com',
    category: 'Entertainment',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    order: 8,
    translations: {
      en: { name: 'Spotify', description: 'Music streaming' },
      'zh-TW': { name: 'Spotify', description: '音樂與 Podcast 串流' },
      'zh-CN': { name: 'Spotify', description: '音乐与播客流媒体' }
    },
    isGlobal: false,
  },
  {
    id: '9',
    url: 'https://netflix.com',
    category: 'Entertainment',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    order: 9,
    translations: {
      en: { name: 'Netflix', description: 'Movie streaming' },
      'zh-TW': { name: 'Netflix', description: '熱門影音串流服務' },
      'zh-CN': { name: 'Netflix', description: '热门影视流媒体服务' }
    },
    isGlobal: false,
  },
  {
    id: '10',
    url: 'https://figma.com',
    category: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    order: 10,
    translations: {
      en: { name: 'Figma', description: 'Interface design and prototyping' },
      'zh-TW': { name: 'Figma', description: '介面設計與原型協作' },
      'zh-CN': { name: 'Figma', description: '界面设计与原型协作' }
    },
    isGlobal: false,
  },
  {
    id: '11',
    url: 'https://chat.openai.com',
    category: 'AI',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    order: 11,
    translations: {
      en: { name: 'ChatGPT', description: 'OpenAI conversational AI' },
      'zh-TW': { name: 'ChatGPT', description: 'OpenAI 對話式人工智慧' },
      'zh-CN': { name: 'ChatGPT', description: 'OpenAI 对话式人工智能' }
    },
    isGlobal: false,
  },
  {
    id: '12',
    url: 'https://claude.ai',
    category: 'AI',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Anthropic_logo.svg',
    order: 12,
    translations: {
      en: { name: 'Claude', description: 'Anthropic AI assistant' },
      'zh-TW': { name: 'Claude', description: 'Anthropic AI 助手' },
      'zh-CN': { name: 'Claude', description: 'Anthropic AI 助手' }
    },
    isGlobal: false,
  },
  {
    id: '13',
    url: 'https://www.youtube.com',
    category: 'Entertainment',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    order: 13,
    translations: {
      en: { name: 'YouTube', description: 'Video sharing platform' },
      'zh-TW': { name: 'YouTube', description: '影音串流平台' },
      'zh-CN': { name: 'YouTube', description: '视频分享平台' }
    },
    isGlobal: false,
  },
  {
    id: '14',
    url: 'https://discord.com',
    category: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Discord_Logo_sans_texte.svg',
    order: 14,
    translations: {
      en: { name: 'Discord', description: 'Community voice and chat' },
      'zh-TW': { name: 'Discord', description: '社群語音與即時通訊' },
      'zh-CN': { name: 'Discord', description: '社群语音与即时通讯' }
    },
    isGlobal: false,
  },
  {
    id: '15',
    url: 'https://miro.com',
    category: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Miro_logo.svg',
    order: 15,
    translations: {
      en: { name: 'Miro', description: 'Visual collaboration whiteboard' },
      'zh-TW': { name: 'Miro', description: '線上視覺化協作白板' },
      'zh-CN': { name: 'Miro', description: '在线可视化协作白板' }
    },
    isGlobal: false,
  },
  {
    id: '16',
    url: 'https://www.canva.com',
    category: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    order: 16,
    translations: {
      en: { name: 'Canva', description: 'Graphic design platform' },
      'zh-TW': { name: 'Canva', description: '線上平面設計平台' },
      'zh-CN': { name: 'Canva', description: '在线平面设计平台' }
    },
    isGlobal: false,
  }
];
