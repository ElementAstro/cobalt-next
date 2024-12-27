"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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

export const RaInput: React.FC<IInputProps> = (props) => {
  const [degree, setDegree] = React.useState("0");
  const [minute, setMinute] = React.useState("0");
  const [second, setSecond] = React.useState("0");
  const [degreeValue, setDegreeValue] = React.useState("0");
  const [degreeUpdate, setDegreeUpdate] = React.useState(false);
  const [dmsUpdate, setDmsUpdate] = React.useState(false);
  const [degreeSwitch, setDegreeSwitch] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    setDegreeValue(String(props.value));
    const newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  React.useEffect(() => {
    if (degreeUpdate) {
      const newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate, degreeValue, props]);

  React.useEffect(() => {
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

  const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = await navigator.clipboard.readText();
    const coords = parseCoordsFromText(text);
    if (coords) {
      setDegree(coords.degrees.toString());
      setMinute(coords.minutes.toString());
      setSecond(coords.seconds.toString());
      setDmsUpdate(true);
    }
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
          <div className="flex justify-between items-center">
            <Label className="text-white text-lg">RA</Label>
            <Button
              variant="link"
              size="sm"
              onClick={() => setDegreeSwitch(!degreeSwitch)}
              className="text-blue-400"
            >
              {degreeSwitch ? "DMS" : "Degrees"}
            </Button>
          </div>
          <div className="relative">
            {degreeSwitch ? (
              <motion.div
                className="relative flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={onBlurUpdateValue}
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
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={degree}
                  onChange={(e) => handleDMSChange("degree", e.target.value)}
                  aria-label="RA Degrees"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={minute}
                  onChange={(e) => handleDMSChange("minute", e.target.value)}
                  aria-label="RA Minutes"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
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
          </div>
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
      <div className="flex gap-2 mt-4">
        {commonValues.map(({ label, value }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => {
              setDegreeValue(value.toString());
              setDegreeUpdate(true);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export const DecInput: React.FC<IInputProps> = (props) => {
  const [degree, setDegree] = React.useState("0");
  const [minute, setMinute] = React.useState("0");
  const [second, setSecond] = React.useState("0");
  const [degreeValue, setDegreeValue] = React.useState("0");
  const [degreeUpdate, setDegreeUpdate] = React.useState(false);
  const [dmsUpdate, setDmsUpdate] = React.useState(false);
  const [degreeSwitch, setDegreeSwitch] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    setDegreeValue(String(props.value));
    const newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  React.useEffect(() => {
    if (degreeUpdate) {
      const newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate, degreeValue, props]);

  React.useEffect(() => {
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

  const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = await navigator.clipboard.readText();
    const coords = parseCoordsFromText(text);
    if (coords) {
      setDegree(coords.degrees.toString());
      setMinute(coords.minutes.toString());
      setSecond(coords.seconds.toString());
      setDmsUpdate(true);
    }
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
          <div className="flex justify-between items-center">
            <Label className="text-white text-lg">DEC</Label>
            <Button
              variant="link"
              size="sm"
              onClick={() => setDegreeSwitch(!degreeSwitch)}
              className="text-blue-400"
            >
              {degreeSwitch ? "DMS" : "Degrees"}
            </Button>
          </div>
          <div className="relative">
            {degreeSwitch ? (
              <motion.div
                className="relative flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={onBlurUpdateValue}
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
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={degree}
                  onChange={(e) => handleDMSChange("degree", e.target.value)}
                  aria-label="DEC Degrees"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={minute}
                  onChange={(e) => handleDMSChange("minute", e.target.value)}
                  aria-label="DEC Minutes"
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
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
          </div>
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
      <div className="flex gap-2 mt-4">
        {commonValues.map(({ label, value }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => {
              setDegreeValue(value.toString());
              setDegreeUpdate(true);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
