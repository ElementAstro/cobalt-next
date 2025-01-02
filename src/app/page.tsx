"use client";

import { useEffect, useState } from "react";
import Header from "@/components/home/header";
import QuickAccess from "@/components/home/quick-access";
import CategoryFilter from "@/components/home/category-filter";
import SiteList from "@/components/home/site-list";
import PreviewModal from "@/components/home/preview-modal";
import { Site } from "@/types/home";
import { toast } from "@/hooks/use-toast";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AddEditSiteDialog from "@/components/home/add-edit-site-dialog";
import { useSiteStore } from "@/store/useHomeStore";
import CookieConsent from "@/components/home/cookie-consent";
import { UserAgreementMask } from "@/components/home/user-agreement-mask";
import { Github } from "lucide-react";
import MouseFollower from "@/components/home/mouse-follower";

const defaultSites: Site[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    icon: Github,
    category: "Development",
  },
  {
    id: "2",
    name: "Dashboard",
    url: "/dashboard",
    icon: "google",
    category: "Search",
  },
  // ...其他默认站点
];

export default function Home() {
  const {
    sites,
    quickAccessSites,
    searchTerm,
    activeCategory,
    addSite,
    updateSite,
    removeSite,
    toggleQuickAccess,
    setSearchTerm,
    setActiveCategory,
    setSites,
    setQuickAccessSites,
    reorderSites,
    setBackgroundColor,
    setLayoutMode,
    setCardStyle,
  } = useSiteStore();

  const [previewUrl, setPreviewUrl] = useState("");
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleAddNewSite = () => {
    setEditingSite(null);
    openDialog();
  };

  const handleEditSite = () => {
    openDialog();
  };

  const controls = useAnimation();
  const [ref, inView] = useInView();

  const [agreed, setAgreed] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleAgree = () => {
    setAgreed(true);
  };

  const handleDisagree = () => {
    toast({
      title: "Error",
      description: "You must agree to the user agreement to continue.",
    });
  };

  const agreementText = {
    en: `
      This is a sample user agreement. In actual use, you should place your full user agreement content here.
  
      1. Terms of Service: This agreement is a legal agreement between you and us regarding the use of our services.
      
      2. User Obligations: You agree to comply with all applicable laws and regulations.
      
      3. Intellectual Property: Our services and content are protected by intellectual property laws.
      
      4. Disclaimer: We are not responsible for any losses resulting from the use of our services.
      
      5. Agreement Modification: We reserve the right to modify this agreement at any time.
      
      6. Governing Law: This agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.
      
      7. Dispute Resolution: Any disputes arising out of or in connection with this agreement shall be resolved through amicable negotiations. If such negotiations fail, the disputes shall be submitted to the competent courts of the jurisdiction in which we operate.
      
      8. Termination: We reserve the right to terminate your access to our services if you violate any terms of this agreement.
      
      9. Contact Information: If you have any questions about this agreement, please contact us at [contact information].
  
      Please read the above terms carefully. If you agree, please click the "Agree and Continue" button.
    `,
    zh: `
      这是一个示例用户协议。在实际使用时，您应该在这里放置您的完整用户协议内容。
  
      1. 服务条款：本协议是您与我们之间关于使用我们服务的法律协议。
      
      2. 用户义务：您同意遵守所有适用的法律和法规。
      
      3. 知识产权：我们的服务和内容受知识产权法保护。
      
      4. 免责声明：我们不对因使用我们的服务而导致的任何损失负责。
      
      5. 协议修改：我们保留随时修改本协议的权利。
      
      6. 适用法律：本协议应受我们运营所在司法管辖区的法律管辖并按其解释。
      
      7. 争议解决：因本协议引起或与本协议有关的任何争议应通过友好协商解决。如果协商失败，争议应提交我们运营所在司法管辖区的有管辖权的法院解决。
      
      8. 终止：如果您违反本协议的任何条款，我们保留终止您访问我们服务的权利。
      
      9. 联系信息：如果您对本协议有任何疑问，请通过[联系信息]联系我们。
  
      请仔细阅读以上条款。如果您同意，请点击"同意并继续"按钮。
    `,
  };

  const privacyPolicyText = {
    en: `
      Privacy Policy for Cobalt & Lithium

      Effective Date: [Insert Date]

      Welcome to Cobalt & Lithium, the premier software for astronomical photography control. Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, protect, and share your personal information when you use our software and services.

      1. Information Collection:
         - Personal Information: We collect information you provide during account creation, such as your name, email address, and payment details.
         - Usage Data: We automatically collect data on how you interact with our software, including device information, IP address, and usage patterns.
         - Astronomical Data: We may collect metadata related to your astronomical photography sessions, such as telescope settings, location data, and timestamps.

      2. Information Use:
         - To provide and maintain our services, including software updates and customer support.
         - To improve and personalize your experience with Cobalt & Lithium.
         - To communicate with you about updates, promotions, and important notices.
         - To conduct research and analysis to enhance our software and services.

      3. Information Sharing:
         - We do not sell your personal information. We may share information with trusted third-party service providers who assist us in delivering our services, such as cloud storage providers and payment processors.
         - We may disclose information if required by law or to protect our rights and the safety of our users.

      4. Data Security:
         - We implement industry-standard security measures to protect your personal information, including encryption, access controls, and regular security audits.
         - Despite our efforts, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.

      5. Your Rights:
         - You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us directly for assistance.
         - You may opt-out of receiving promotional communications at any time by following the unsubscribe instructions in our emails.

      6. Cookies and Tracking Technologies:
         - We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.

      7. Third-Party Services:
         - Our software may integrate with third-party services, such as cloud storage platforms or social media networks. These services have their own privacy policies, and we encourage you to review them.

      8. Data Retention:
         - We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. We will delete or anonymize your data upon request, subject to legal obligations.

      9. Changes to Privacy Policy:
         - We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes through our software or via email.

      10. Contact Information:
         - If you have any questions or concerns about this Privacy Policy, please contact us at [Insert Contact Information].

      By using Cobalt & Lithium, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use our software.

      Thank you for choosing Cobalt & Lithium for your astronomical photography needs.
    `,
    zh: `
      Cobalt & Lithium 隐私政策

      生效日期: [插入日期]

      欢迎使用Cobalt & Lithium，这是天文摄影控制的首选软件。您的隐私对我们至关重要。本隐私政策概述了我们在您使用我们的软件和服务时如何收集、使用、保护和共享您的个人信息。

      1. 信息收集:
         - 个人信息: 我们收集您在账户创建时提供的信息，例如您的姓名、电子邮件地址和支付详情。
         - 使用数据: 我们自动收集您与软件交互的数据，包括设备信息、IP地址和使用模式。
         - 天文数据: 我们可能会收集与您的天文摄影会话相关的元数据，例如望远镜设置、位置数据和时间戳。

      2. 信息使用:
         - 提供和维护我们的服务，包括软件更新和客户支持。
         - 改善和个性化您使用Cobalt & Lithium的体验。
         - 与您沟通更新、促销和重要通知。
         - 进行研究和分析以增强我们的软件和服务。

      3. 信息共享:
         - 我们不会出售您的个人信息。我们可能会与协助我们提供服务的可信第三方服务提供商共享信息，例如云存储提供商和支付处理器。
         - 如果法律要求或为了保护我们的权利和用户的安全，我们可能会披露信息。

      4. 数据安全:
         - 我们实施行业标准的安全措施来保护您的个人信息，包括加密、访问控制和定期安全审计。
         - 尽管我们努力，但通过互联网传输或电子存储的方法并非100%安全。我们无法保证绝对安全。

      5. 您的权利:
         - 您有权访问、更正或删除您的个人信息。您可以管理您的账户设置或直接联系我们寻求帮助。
         - 您可以随时通过按照我们电子邮件中的退订说明选择退出接收促销通讯。

      6. Cookies和跟踪技术:
         - 我们使用cookies和类似技术来增强您的体验、分析使用情况并提供个性化内容。您可以通过浏览器设置控制cookies。

      7. 第三方服务:
         - 我们的软件可能会与第三方服务集成，例如云存储平台或社交媒体网络。这些服务有自己的隐私政策，我们鼓励您查看它们。

      8. 数据保留:
         - 我们会在必要时保留您的个人信息，以实现本政策中概述的目的，或根据法律要求。我们将在请求时删除或匿名化您的数据，但受法律义务的限制。

      9. 隐私政策变更:
         - 我们可能会定期更新本隐私政策，以反映我们的实践或法律要求的变化。我们将通过我们的软件或电子邮件通知您重大变更。

      10. 联系信息:
         - 如果您对本隐私政策有任何疑问或疑虑，请通过[插入联系信息]联系我们。

      使用Cobalt & Lithium即表示您已阅读并理解本隐私政策。如果您不同意我们的做法，请不要使用我们的软件。

      感谢您选择Cobalt & Lithium满足您的天文摄影需求。
    `,
  };

  useEffect(() => {
    const savedSites = localStorage.getItem("sites");
    if (savedSites !== null) {
      const parsedSites = JSON.parse(savedSites);
      if (parsedSites.length === 0) {
        setSites(defaultSites);
      } else {
        setSites(parsedSites);
      }
    } else {
      setSites(defaultSites);
    }
  }, [setSites]);

  useEffect(() => {
    localStorage.setItem("sites", JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === "All" || site.category === activeCategory)
  );

  const categories = [
    "All",
    ...Array.from(new Set(sites.map((site) => site.category))),
  ];

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderSites(result.source.index, result.destination.index);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(sites);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "my_navigation_hub_data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          try {
            const importedSites = JSON.parse(content);
            setSites(importedSites);
            toast({
              title: "Success",
              description: "Data imported successfully!",
            });
          } catch (error) {
            console.error("Error parsing imported data:", error);
            toast({
              title: "Error",
              description:
                "Error importing data. Please check the file format.",
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const openPreview = (site: Site) => {
    setSelectedSite(site);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedSite(null);
  };

  const [color, setColor] = useState("#3b82f6");
  const [size, setSize] = useState(24);
  const [blur, setBlur] = useState(0);
  const [trail, setTrail] = useState(5);
  const [trailColor, setTrailColor] = useState("rgba(59, 130, 246, 0.5)");
  const [trailBlur, setTrailBlur] = useState(5);
  const [animationDuration, setAnimationDuration] = useState(0.2);
  const [animationType, setAnimationType] = useState<"spring" | "tween">(
    "spring"
  );
  const [springStiffness, setSpringStiffness] = useState(500);
  const [springDamping, setSpringDamping] = useState(28);
  const [scaleOnTouch, setScaleOnTouch] = useState(true);
  const [rotateOnMove, setRotateOnMove] = useState(true);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 dark:from-gray-900 dark:to-black p-2 sm:p-4 transition-colors duration-300"
      ref={ref}
    >
      <MouseFollower
        color={color}
        size={size}
        blur={blur}
        trail={trail}
        trailColor={trailColor}
        trailBlur={trailBlur}
        animationDuration={animationDuration}
        animationType={animationType}
        springStiffness={springStiffness}
        springDamping={springDamping}
        scaleOnTouch={scaleOnTouch}
        rotateOnMove={rotateOnMove}
      />
      <div className=" mx-auto px-2 sm:px-4">
        <div className=" gap-4">
          <div className="flex flex-wrap gap-4">
            <Header
              exportData={exportData}
              importData={importData}
              onAddNewSite={handleAddNewSite}
              onSearch={setSearchTerm}
              toggleTheme={() => {}}
              isDark={false}
              setBackgroundColor={setBackgroundColor}
              setLayoutMode={setLayoutMode}
              setCardStyle={setCardStyle}
            />
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <QuickAccess />
          </div>

          <div className="space-y-4">
            <SiteList
              sites={filteredSites}
              onDragEnd={onDragEnd}
              removeSite={removeSite}
              toggleQuickAccess={toggleQuickAccess}
              setEditingSite={(site) => {
                setEditingSite(site);
                handleEditSite();
              }}
              controls={controls}
              onPreview={openPreview}
            />
          </div>
        </div>
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          site={selectedSite}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <AddEditSiteDialog
              editingSite={editingSite}
              setEditingSite={setEditingSite}
            />
          </DialogContent>
        </Dialog>
      </div>
      <UserAgreementMask
        agreementText={agreementText}
        privacyPolicyText={privacyPolicyText}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
        language={language}
        version="1.0"
        requireReadConfirmation={true}
        allowPrint={true}
      />
      <CookieConsent />
    </motion.main>
  );
}
