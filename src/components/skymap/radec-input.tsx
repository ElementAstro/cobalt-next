"use client";

import React, {
  ChangeEvent,
  FC,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Copy,
  ClipboardCheck,
  MapPin,
} from "lucide-react";

interface IInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

function degToDMS(deg: number) {
  const degrees = Math.floor(deg);
  const minutes = Math.floor((deg - degrees) * 60);
  const seconds = Math.round((deg - degrees - minutes / 60) * 3600);
  return { degrees, minutes, seconds };
}

function dmsToDeg(degrees: number, minutes: number, seconds: number) {
  return degrees + minutes / 60 + seconds / 3600;
}

const parseCoordsFromText = (text: string) => {
  const matches = text.match(/(-?\d{1,3})[° ](\d{1,2})[′ ](\d{1,2})[″ ]/);
  if (!matches) return null;
  return {
    degrees: parseInt(matches[1], 10),
    minutes: parseInt(matches[2], 10),
    seconds: parseFloat(matches[3]),
  };
};

// 添加输入动画和交互效果
const inputVariants = {
  focus: { scale: 1.02, boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.5)" },
  blur: { scale: 1, boxShadow: "none" },
};

// 添加预设值动画
const presetButtonVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const RaInput: FC<IInputProps> = (props) => {
  const [degree, setDegree] = useState("0");
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");
  const [degreeValue, setDegreeValue] = useState("0");
  const [degreeUpdate, setDegreeUpdate] = useState(false);
  const [dmsUpdate, setDmsUpdate] = useState(false);
  const [degreeSwitch, setDegreeSwitch] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 添加新的动画效果
  const inputAnimationVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.5)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    blur: {
      scale: 1,
      boxShadow: "none",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  // 添加输入验证和格式化
  const formatInput = useCallback(
    (value: string, type: "degree" | "minute" | "second") => {
      let num = parseFloat(value);
      if (isNaN(num)) return "0";

      switch (type) {
        case "degree":
          return Math.max(-180, Math.min(180, num)).toString();
        case "minute":
        case "second":
          return Math.max(0, Math.min(59, num)).toString();
      }
    },
    []
  );

  // 添加实时预览
  const getPreviewValue = useCallback(() => {
    const deg = parseFloat(degree);
    const min = parseFloat(minute);
    const sec = parseFloat(second);
    return dmsToDeg(deg, min, sec);
  }, [degree, minute, second]);

  useEffect(() => {
    setDegreeValue(String(props.value));
    const newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  useEffect(() => {
    if (degreeUpdate) {
      const newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate, degreeValue, props]);

  useEffect(() => {
    if (dmsUpdate) {
      const newDegree = dmsToDeg(
        parseInt(degree, 10),
        parseInt(minute, 10),
        parseFloat(second)
      );
      setDegreeValue(String(newDegree));
      setDmsUpdate(false);
      props.onChange(newDegree);
    }
  }, [dmsUpdate, degree, minute, second, props]);

  const onBlurUpdateValue = () => {
    if (degreeSwitch) {
      setDegreeUpdate(true);
    } else {
      setDmsUpdate(true);
    }
  };

  const handleDegreeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (parseInt(val, 10) > 180) val = "180";
    if (parseInt(val, 10) < -180) val = "-180";
    setDegreeValue(val);
  };

  const handleDMSChange = (
    type: "degree" | "minute" | "second",
    value: string
  ) => {
    let val = value;
    if (type === "minute" || type === "second") {
      if (parseInt(val, 10) >= 60) val = "59";
      if (parseInt(val, 10) < 0) val = "0";
    }
    if (
      (type === "minute" || type === "second") &&
      (parseInt(degree, 10) === 180 || parseInt(degree, 10) === -180)
    ) {
      val = "0";
    }

    switch (type) {
      case "degree":
        setDegree(val);
        break;
      case "minute":
        setMinute(val);
        break;
      case "second":
        setSecond(val);
        break;
      default:
        break;
    }
  };

  // 新增剪贴板功能
  const [isCopied, setIsCopied] = useState(false);

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    try {
      const text = await navigator.clipboard.readText();
      const coords = parseCoordsFromText(text);
      if (coords) {
        setDegree(coords.degrees.toString());
        setMinute(coords.minutes.toString());
        setSecond(coords.seconds.toString());
        setDmsUpdate(true);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleCopy = () => {
    const text = `${degree}° ${minute}′ ${second}″`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(console.error);
  };

  // 新增快速预设值
  const commonValues = [
    { label: "天球赤道", value: 0 },
    { label: "北天极", value: 90 },
    { label: "南天极", value: -90 },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6 p-6 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg dark:bg-gray-900/90 border border-gray-700 landscape:p-3 landscape:gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 landscape:gap-3"
        layout
      >
        <div className="flex flex-col space-y-4 landscape:space-y-2">
          <div className="flex justify-between items-center gap-2">
            <Label className="text-white text-lg flex items-center gap-1">
              <Compass className="w-4 h-4" />
              RA
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-blue-400 hover:bg-blue-400/10 p-1.5"
              >
                {isCopied ? (
                  <ClipboardCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setDegreeSwitch(!degreeSwitch)}
                className="text-blue-400"
              >
                {degreeSwitch ? "DMS" : "Degrees"}
              </Button>
            </div>
          </div>
          <motion.div
            className="relative"
            initial={false}
            animate={isEditing ? "focus" : "blur"}
            variants={inputAnimationVariants}
          >
            {degreeSwitch ? (
              <motion.div
                className="relative flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={degreeValue}
                  onChange={handleDegreeChange}
                  aria-label="RA Degrees"
                  className="w-24 bg-gray-700 text-white"
                />
                <span className="text-muted-foreground">°</span>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={degree}
                  onChange={(e) => handleDMSChange("degree", e.target.value)}
                  aria-label="RA Degrees"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={minute}
                  onChange={(e) => handleDMSChange("minute", e.target.value)}
                  aria-label="RA Minutes"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={second}
                  onChange={(e) => handleDMSChange("second", e.target.value)}
                  aria-label="RA Seconds"
                  className="w-full bg-gray-700 text-white"
                />
                <div className="col-span-3 flex justify-between text-xs text-muted-foreground">
                  <span>度</span>
                  <span>分</span>
                  <span>秒</span>
                </div>
              </motion.div>
            )}
            {showPreview && (
              <motion.div
                className="absolute right-0 top-full mt-2 bg-gray-700 p-3 rounded shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-white">
                  {degreeSwitch
                    ? `${degreeValue}°`
                    : `${degree}° ${minute}′ ${second}″`}{" "}
                  = {degreeValue}°
                </p>
              </motion.div>
            )}
            {/* 添加实时预览 */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 right-0 text-xs text-gray-400"
                >
                  预览值: {getPreviewValue().toFixed(6)}°
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <motion.div
          className="relative h-40 hidden md:block landscape:h-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* 添加角度可视化表示 */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${parseFloat(degreeValue)}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <div className="w-1 h-20 bg-blue-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
      <Button
        variant="ghost"
        size="sm"
        className="self-end text-blue-400"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? "隐藏预览" : "显示预览"}
      </Button>
      {/* 新增快速选择按钮 */}
      <motion.div
        className="grid grid-cols-2 gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {commonValues.map(({ label, value }) => (
          <motion.button
            key={label}
            variants={presetButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              setDegreeValue(value.toString());
              setDegreeUpdate(true);
            }}
            className="px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 rounded-lg backdrop-blur-sm"
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
      {/* 添加角度可视化 */}
      <motion.div
        className="mt-4 relative h-32 bg-gray-800/50 rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: parseFloat(degreeValue) }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="w-1 h-full bg-gradient-to-b from-blue-500 to-transparent"
            style={{ transformOrigin: "center center" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const DecInput: FC<IInputProps> = (props) => {
  const [degree, setDegree] = useState("0");
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");
  const [degreeValue, setDegreeValue] = useState("0");
  const [degreeUpdate, setDegreeUpdate] = useState(false);
  const [dmsUpdate, setDmsUpdate] = useState(false);
  const [degreeSwitch, setDegreeSwitch] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDegreeValue(String(props.value));
    const newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  useEffect(() => {
    if (degreeUpdate) {
      const newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate, degreeValue, props]);

  useEffect(() => {
    if (dmsUpdate) {
      const newDegree = dmsToDeg(
        parseInt(degree, 10),
        parseInt(minute, 10),
        parseFloat(second)
      );
      setDegreeValue(String(newDegree));
      setDmsUpdate(false);
      props.onChange(newDegree);
    }
  }, [dmsUpdate, degree, minute, second, props]);

  const onBlurUpdateValue = () => {
    if (degreeSwitch) {
      setDegreeUpdate(true);
    } else {
      setDmsUpdate(true);
    }
  };

  const handleDegreeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (parseInt(val, 10) > 90) val = "90";
    if (parseInt(val, 10) < -90) val = "-90";
    setDegreeValue(val);
  };

  const handleDMSChange = (
    type: "degree" | "minute" | "second",
    value: string
  ) => {
    let val = value;
    if (type === "minute" || type === "second") {
      if (parseInt(val, 10) >= 60) val = "59";
      if (parseInt(val, 10) < 0) val = "0";
    }
    if (
      (type === "minute" || type === "second") &&
      (parseInt(degree, 10) === 90 || parseInt(degree, 10) === -90)
    ) {
      val = "0";
    }

    switch (type) {
      case "degree":
        setDegree(val);
        break;
      case "minute":
        setMinute(val);
        break;
      case "second":
        setSecond(val);
        break;
      default:
        break;
    }
  };

  // 新增剪贴板功能
  const [isCopied, setIsCopied] = useState(false);

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    try {
      const text = await navigator.clipboard.readText();
      const coords = parseCoordsFromText(text);
      if (coords) {
        setDegree(coords.degrees.toString());
        setMinute(coords.minutes.toString());
        setSecond(coords.seconds.toString());
        setDmsUpdate(true);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleCopy = () => {
    const text = `${degree}° ${minute}′ ${second}″`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(console.error);
  };

  // 新增快速预设值
  const commonValues = [
    { label: "天球赤道", value: 0 },
    { label: "北天极", value: 90 },
    { label: "南天极", value: -90 },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6 p-6 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg dark:bg-gray-900/90 border border-gray-700 landscape:p-3 landscape:gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 landscape:gap-3"
        layout
      >
        <div className="flex flex-col space-y-4 landscape:space-y-2">
          <div className="flex justify-between items-center gap-2">
            <Label className="text-white text-lg flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              DEC
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-blue-400 hover:bg-blue-400/10 p-1.5"
              >
                {isCopied ? (
                  <ClipboardCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setDegreeSwitch(!degreeSwitch)}
                className="text-blue-400"
              >
                {degreeSwitch ? "DMS" : "Degrees"}
              </Button>
            </div>
          </div>
          <motion.div
            className="relative"
            initial={false}
            animate={isEditing ? "focus" : "blur"}
          >
            {degreeSwitch ? (
              <motion.div
                className="relative flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={degreeValue}
                  onChange={handleDegreeChange}
                  aria-label="DEC Degrees"
                  className="w-24 bg-gray-700 text-white"
                />
                <span className="text-muted-foreground">°</span>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={degree}
                  onChange={(e) => handleDMSChange("degree", e.target.value)}
                  aria-label="DEC Degrees"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={minute}
                  onChange={(e) => handleDMSChange("minute", e.target.value)}
                  aria-label="DEC Minutes"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={() => {
                    onBlurUpdateValue();
                    setIsEditing(false);
                  }}
                  onFocus={() => setIsEditing(true)}
                  type="number"
                  value={second}
                  onChange={(e) => handleDMSChange("second", e.target.value)}
                  aria-label="DEC Seconds"
                  className="w-full bg-gray-700 text-white"
                />
                <div className="col-span-3 flex justify-between text-xs text-muted-foreground">
                  <span>度</span>
                  <span>分</span>
                  <span>秒</span>
                </div>
              </motion.div>
            )}
            {showPreview && (
              <motion.div
                className="absolute right-0 top-full mt-2 bg-gray-700 p-3 rounded shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-white">
                  {degreeSwitch
                    ? `${degreeValue}°`
                    : `${degree}° ${minute}′ ${second}″`}{" "}
                  = {degreeValue}°
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
        <motion.div
          className="relative h-40 hidden md:block landscape:h-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* 添加角度可视化表示 */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${parseFloat(degreeValue)}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <div className="w-1 h-20 bg-blue-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
      <Button
        variant="ghost"
        size="sm"
        className="self-end text-blue-400"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? "隐藏预览" : "显示预览"}
      </Button>
      {/* 新增快速选择按钮 */}
      <motion.div
        className="grid grid-cols-2 gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {commonValues.map(({ label, value }) => (
          <motion.button
            key={label}
            variants={presetButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              setDegreeValue(value.toString());
              setDegreeUpdate(true);
            }}
            className="px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 rounded-lg backdrop-blur-sm"
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
      {/* 添加角度可视化 */}
      <motion.div
        className="mt-4 relative h-32 bg-gray-800/50 rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: parseFloat(degreeValue) }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="w-1 h-full bg-gradient-to-b from-blue-500 to-transparent"
            style={{ transformOrigin: "center center" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default memo(RaInput);
