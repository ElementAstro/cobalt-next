import React, { useState, useRef, useEffect } from "react";
import { CascaderProps, CascaderOption } from "@/types/custom/cascader";
import CascaderMenu from "./CascaderMenu";
import { useClickOutside } from "../../hooks/use-click-outside";
import { ChevronDown, X, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Cascader: React.FC<CascaderProps> = ({
  options,
  placeholder = "请选择",
  multiple = false,
  clearable = false,
  disabled = false,
  showPath = true,
  separator = " / ",
  expandTrigger = "click",
  filterable = false,
  onChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<CascaderOption[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && filterable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, filterable]);

  const handleSelect = (option: CascaderOption, path: CascaderOption[]) => {
    if (multiple) {
      const newSelectedOptions = [...selectedOptions];
      const index = newSelectedOptions.findIndex(
        (o) => o.value === option.value
      );
      if (index > -1) {
        newSelectedOptions.splice(index, 1);
      } else {
        newSelectedOptions.push(option);
      }
      setSelectedOptions(newSelectedOptions);
      onChange?.(
        newSelectedOptions.map((o) => o.value),
        newSelectedOptions,
        path
      );
    } else {
      setSelectedOptions([option]);
      setIsOpen(false);
      onChange?.([option.value], [option], path);
    }
    setSearchValue("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOptions([]);
    onChange?.([], [], []);
    setSearchValue("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const renderValue = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }

    return selectedOptions.map((option, index) => (
      <span key={option.value} className="mr-1">
        {showPath
          ? option.path?.map((o: CascaderOption) => o.label).join(separator)
          : option.label}
        {index < selectedOptions.length - 1 && ", "}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xs md:max-w-md lg:max-w-lg"
    >
      <div
        className={`border rounded-md p-2 flex justify-between items-center cursor-pointer ${
          disabled
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            : "bg-white dark:bg-gray-700"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-grow overflow-hidden">
          {filterable && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100"
              value={searchValue}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            renderValue()
          )}
        </div>
        <div className="flex items-center">
          {filterable && (
            <Search
              size={16}
              className="text-gray-400 dark:text-gray-500 mr-1"
            />
          )}
          {clearable && selectedOptions.length > 0 && (
            <X
              size={16}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mr-1"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg"
          >
            <CascaderMenu
              options={options}
              onSelect={handleSelect}
              selectedOptions={selectedOptions}
              multiple={multiple}
              expandTrigger={expandTrigger}
              searchValue={searchValue}
              {...props}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cascader;
