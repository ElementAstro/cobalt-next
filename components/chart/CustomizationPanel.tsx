import React from "react";
import { motion } from "framer-motion";
import { Save, X as Reset, Palette, LineChartIcon } from "lucide-react";

interface CustomizationPanelProps {
  updateInterval: number;
  setUpdateInterval: (interval: number) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  showComponents: {
    searchBar: boolean;
    statusBar: boolean;
  };
  setShowComponents: (components: {
    searchBar: boolean;
    statusBar: boolean;
  }) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  updateInterval,
  setUpdateInterval,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  language,
  setLanguage,
  primaryColor,
  setPrimaryColor,
  showComponents,
  setShowComponents,
}) => {
  const handleReset = () => {
    setUpdateInterval(1000);
    setDarkMode(false);
    setFontSize("medium");
    setLanguage("zh-cn");
    setPrimaryColor("#3b82f6");
    setShowComponents({ searchBar: true, statusBar: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Palette className="mr-2" /> 自定义选项
      </h2>
      <div className="flex flex-col space-y-6">
        {/* 更新间隔 */}
        <div>
          <label htmlFor="updateInterval" className="block mb-2 font-medium">
            更新间隔 (毫秒):
          </label>
          <input
            id="updateInterval"
            type="number"
            min="100"
            max="10000"
            step="100"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className={`w-full p-3 rounded border ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* 暗色模式 */}
        <div>
          <label htmlFor="darkMode" className="flex items-center space-x-2">
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="form-checkbox h-6 w-6 text-blue-600"
            />
            <span className="text-lg">暗色模式</span>
          </label>
        </div>

        {/* 字体大小 */}
        <div>
          <label htmlFor="fontSize" className="block mb-2 font-medium">
            <LineChartIcon className="mr-2" /> 字体大小:
          </label>
          <select
            id="fontSize"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={`w-full p-3 rounded border ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>

        {/* 语言选择 */}
        <div>
          <label htmlFor="language" className="block mb-2 font-medium">
            <i className="mr-2">🌐</i> 语言选择:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full p-3 rounded border ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="zh-cn">中文</option>
            <option value="en-us">English</option>
          </select>
        </div>

        {/* 主要颜色选择 */}
        <div>
          <label htmlFor="primaryColor" className="block mb-2 font-medium">
            <Palette className="mr-2" /> 主要颜色:
          </label>
          <input
            id="primaryColor"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-full h-12 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>

        {/* 显示/隐藏组件 */}
        <div>
          <h3 className="mb-2 font-medium">显示/隐藏组件</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showComponents.searchBar}
                onChange={(e) =>
                  setShowComponents({
                    ...showComponents,
                    searchBar: e.target.checked,
                  })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>搜索栏</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showComponents.statusBar}
                onChange={(e) =>
                  setShowComponents({
                    ...showComponents,
                    statusBar: e.target.checked,
                  })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>状态栏</span>
            </label>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center justify-center w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
          >
            <Reset className="mr-2" /> 重置默认
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center justify-center w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
          >
            <Save className="mr-2" /> 保存设置
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizationPanel;
