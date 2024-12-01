export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
}

export const categories = [
  "入门指南",
  "账户管理",
  "功能使用",
  "故障排除",
  "隐私与安全",
];

export const helpTopics: HelpTopic[] = [
  {
    id: "getting-started",
    title: "入门指南",
    description: "了解如何开始使用我们的产品",
    content:
      "欢迎使用我们的产品！要开始使用,请按照以下步骤操作:\n\n1. 创建账户\n2. 设置您的个人资料\n3. 探索功能\n\n如果您需要更多帮助,请随时联系我们的支持团队。",
    category: "入门指南",
    tags: ["新用户", "注册", "设置"],
  },
  {
    id: "account-management",
    title: "账户管理",
    description: "学习如何管理您的账户设置",
    content:
      "管理您的账户很简单。您可以:\n\n- 更新个人信息\n- 更改密码\n- 管理通知设置\n- 查看账单历史\n\n要访问这些设置,请登录后点击右上角的个人资料图标。",
    category: "账户管理",
    tags: ["设置", "密码", "通知", "账单"],
  },
  {
    id: "troubleshooting",
    title: "故障排除",
    description: "常见问题的解决方案",
    content:
      "遇到问题了吗？以下是一些常见问题的解决方案:\n\n1. 无法登录？尝试重置密码。\n2. 页面加载缓慢？清除浏览器缓存。\n3. 功能不工作？确保您使用的是最新版本的浏览器。\n\n如果问题仍然存在,请联系我们的支持团队。",
    category: "故障排除",
    tags: ["登录问题", "性能", "错误"],
  },
  {
    id: "feature-guide",
    title: "功能指南",
    description: "深入了解我们产品的核心功能",
    content:
      "我们的产品提供了许多强大的功能来提高您的工作效率。以下是一些核心功能的简要介绍:\n\n1. 项目管理：创建、组织和跟踪您的项目\n2. 团队协作：邀请团队成员并分配任务\n3. 文件共享：安全地上传和共享文件\n4. 报告生成：创建详细的项目报告和分析\n\n要了解更多关于这些功能的信息,请查看我们的视频教程。",
    category: "功能使用",
    tags: ["项目管理", "协作", "文件共享", "报告"],
  },
  {
    id: "privacy-security",
    title: "隐私与安全",
    description: "了解我们如何保护您的数据",
    content:
      "我们非常重视您的隐私和数据安全。以下是我们采取的一些措施:\n\n1. 端到端加密：所有数据传输都经过加密\n2. 双因素认证：增加额外的安全层\n3. 定期安全审计：确保我们的系统始终安全\n4. 数据备份：定期备份以防数据丢失\n\n如果您有任何关于隐私和安全的问题,请联系我们的安全团队。",
    category: "隐私与安全",
    tags: ["加密", "认证", "数据保护"],
  },
];
