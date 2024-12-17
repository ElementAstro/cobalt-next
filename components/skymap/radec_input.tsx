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
  let degrees = Math.floor(deg);
  let minutes = Math.floor((deg - degrees) * 60);
  let seconds = Math.round((deg - degrees - minutes / 60) * 3600);
  return { degrees, minutes, seconds };
}

function dmsToDeg(degrees: number, minutes: number, seconds: number) {
  return degrees + minutes / 60 + seconds / 3600;
}

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
    let newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  React.useEffect(() => {
    if (degreeUpdate) {
      let newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate]);

  React.useEffect(() => {
    if (dmsUpdate) {
      let newDegree = dmsToDeg(
        parseInt(degree),
        parseInt(minute),
        parseFloat(second)
      );
      setDegreeValue(String(newDegree));
      setDmsUpdate(false);
      props.onChange(newDegree);
    }
  }, [dmsUpdate]);

  const onBlurUpdateValue = () => {
    if (degreeSwitch) {
      setDegreeUpdate(true);
    } else {
      setDmsUpdate(true);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-4 p-4 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg dark:bg-gray-900/90 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        layout
      >
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white">RA</Label>
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
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={degreeValue}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (parseInt(val) > 180) val = "180";
                    if (parseInt(val) < -180) val = "-180";
                    setDegreeValue(val);
                  }}
                  aria-label="RA"
                  className="pr-16 bg-gray-700 text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  度
                </span>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={degree}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (parseInt(val) > 180) val = "180";
                    if (parseInt(val) < -180) val = "-180";
                    setDegree(val);
                  }}
                  aria-label="RA Degrees"
                  className="bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={minute}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (parseInt(val) >= 60) val = "59";
                    if (parseInt(val) < 0) val = "0";
                    if (parseInt(degree) === 180 || parseInt(degree) === -180)
                      val = "0";
                    setMinute(val);
                  }}
                  aria-label="RA Minutes"
                  className="bg-gray-700 text-white"
                />
                <Input
                  onBlur={onBlurUpdateValue}
                  type="number"
                  value={second}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (parseInt(val) >= 60) val = "59";
                    if (parseInt(val) < 0) val = "0";
                    if (parseInt(degree) === 180 || parseInt(degree) === -180)
                      val = "0";
                    setSecond(val);
                  }}
                  aria-label="RA Seconds"
                  className="bg-gray-700 text-white"
                />
                <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
                  <span className="mr-2">度</span>
                  <span className="mr-2">分</span>
                  <span>秒</span>
                </div>
              </motion.div>
            )}
            {showPreview && (
              <motion.div
                className="absolute right-0 top-full mt-1 bg-gray-700 p-2 rounded shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-white">
                  {degreeValue}° = {degree}° {minute}′ {second}″
                </p>
              </motion.div>
            )}
          </div>
        </div>
        <motion.div
          className="relative h-32 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Add a visual representation of the angle */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${parseFloat(degreeValue)}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <div className="w-1 h-16 bg-blue-500 rounded-full" />
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

  React.useEffect(() => {
    setDegreeValue(String(props.value));
    let newDMS = degToDMS(props.value);
    setDegree(String(newDMS.degrees));
    setMinute(String(newDMS.minutes));
    setSecond(String(newDMS.seconds));
  }, [props.value]);

  React.useEffect(() => {
    if (degreeUpdate) {
      let newDMS = degToDMS(parseFloat(degreeValue));
      setDegree(String(newDMS.degrees));
      setMinute(String(newDMS.minutes));
      setSecond(String(newDMS.seconds));
      setDegreeUpdate(false);
      props.onChange(parseFloat(degreeValue));
    }
  }, [degreeUpdate]);

  React.useEffect(() => {
    if (dmsUpdate) {
      let newDegree = dmsToDeg(
        parseInt(degree),
        parseInt(minute),
        parseFloat(second)
      );
      setDegreeValue(String(newDegree));
      setDmsUpdate(false);
      props.onChange(newDegree);
    }
  }, [dmsUpdate]);

  const onBlurUpdateValue = () => {
    if (degreeSwitch) {
      setDegreeUpdate(true);
    } else {
      setDmsUpdate(true);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg shadow-md dark:bg-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <Label className="text-white">DEC</Label>
        <Button
          variant="link"
          size="sm"
          onClick={() => setDegreeSwitch(!degreeSwitch)}
          className="text-blue-400"
        >
          {degreeSwitch ? "DMS" : "Degrees"}
        </Button>
      </div>
      {degreeSwitch ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            onBlur={onBlurUpdateValue}
            type="number"
            value={degreeValue}
            onChange={(e) => {
              let val = e.target.value;
              if (parseInt(val) > 90) val = "90";
              if (parseInt(val) < -90) val = "-90";
              setDegreeValue(val);
            }}
            aria-label="DEC"
            className="bg-gray-700 text-white"
          />
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            onBlur={onBlurUpdateValue}
            type="number"
            value={degree}
            onChange={(e) => {
              let val = e.target.value;
              if (parseInt(val) > 90) val = "90";
              if (parseInt(val) < -90) val = "-90";
              setDegree(val);
            }}
            aria-label="DEC Degrees"
            className="bg-gray-700 text-white"
          />
          <Input
            onBlur={onBlurUpdateValue}
            type="number"
            value={minute}
            onChange={(e) => {
              let val = e.target.value;
              if (parseInt(val) >= 60) val = "59";
              if (parseInt(val) < 0) val = "0";
              if (parseInt(degree) === 90 || parseInt(degree) === -90)
                val = "0";
              setMinute(val);
            }}
            aria-label="DEC Minutes"
            className="bg-gray-700 text-white"
          />
          <Input
            onBlur={onBlurUpdateValue}
            type="number"
            value={second}
            onChange={(e) => {
              let val = e.target.value;
              if (parseInt(val) >= 60) val = "59";
              if (parseInt(val) < 0) val = "0";
              if (parseInt(degree) === 90 || parseInt(degree) === -90)
                val = "0";
              setSecond(val);
            }}
            aria-label="DEC Seconds"
            className="bg-gray-700 text-white"
          />
        </motion.div>
      )}
    </motion.div>
  );
};
