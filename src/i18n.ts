import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  zh: {
    translation: {
      errorTime: "错误时间",
      browser: "浏览器",
      pageURL: "页面URL",
      errorCode: "错误代码",
      errorMessage: "错误信息",
      componentStack: "组件堆栈",
      errorStack: "错误堆栈",
      fatalAppError: "你的应用遇到了致命错误，需要重新启动。",
      fatalSystemError: "你的电脑遇到了问题，需要重新启动。",
      collectingInfoText: "正在收集错误信息...",
      completed: "完成",
      viewErrorDetails: "查看详细错误信息",
      homeButtonText: "返回首页",
      reloadButtonText: "重新加载页面",
    },
  },
  // 你可以添加其他语言
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh", // 默认语言
  fallbackLng: "zh",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
