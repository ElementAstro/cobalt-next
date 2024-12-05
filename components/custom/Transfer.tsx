import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export interface TransferOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface TransferProps {
  options: TransferOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  disabled?: boolean;
  filter?: (
    pattern: string,
    option: TransferOption,
    from: "source" | "target"
  ) => boolean;
  renderSourceLabel?: (props: { option: TransferOption }) => React.ReactNode;
  renderTargetLabel?: (props: { option: TransferOption }) => React.ReactNode;
  renderSourceList?: (props: {
    onCheck: (checkedValueList: (string | number)[]) => void;
    checkedOptions: TransferOption[];
    pattern: string;
  }) => React.ReactNode;
  renderTargetList?: (props: {
    onCheck: (checkedValueList: (string | number)[]) => void;
    checkedOptions: TransferOption[];
    pattern: string;
  }) => React.ReactNode;
  showSelected?: boolean;
  size?: "small" | "medium" | "large";
  sourceFilterable?: boolean;
  sourceFilterPlaceholder?: string;
  sourceTitle?: string | (() => React.ReactNode);
  targetFilterable?: boolean;
  targetFilterPlaceholder?: string;
  targetTitle?: string | (() => React.ReactNode);
  onUpdateValue?: (value: (string | number)[]) => void;
  virtualScroll?: boolean;
  clearText?: string;
  selectAllText?: string;
}

const defaultFilter = (pattern: string, option: TransferOption) =>
  option.label.toLowerCase().includes(pattern.toLowerCase());

export const Transfer: React.FC<TransferProps> = ({
  options,
  value,
  defaultValue = [],
  disabled = false,
  filter = defaultFilter,
  renderSourceLabel,
  renderTargetLabel,
  renderSourceList,
  renderTargetList,
  showSelected = true,
  size = "medium",
  sourceFilterable = false,
  sourceFilterPlaceholder,
  sourceTitle = "Source",
  targetFilterable = false,
  targetFilterPlaceholder,
  targetTitle = "Target",
  onUpdateValue,
  virtualScroll = false,
  clearText = "Clear",
  selectAllText = "Select All",
}) => {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(
    value || defaultValue
  );
  const [sourcePattern, setSourcePattern] = useState("");
  const [targetPattern, setTargetPattern] = useState("");

  const handleValueChange = useCallback(
    (newValue: (string | number)[]) => {
      setInternalValue(newValue);
      onUpdateValue?.(newValue);
    },
    [onUpdateValue]
  );

  const sourceOptions = useMemo(
    () => options.filter((option) => !internalValue.includes(option.value)),
    [options, internalValue]
  );

  const targetOptions = useMemo(
    () => options.filter((option) => internalValue.includes(option.value)),
    [options, internalValue]
  );

  const filteredSourceOptions = useMemo(
    () =>
      sourceOptions.filter((option) => filter(sourcePattern, option, "source")),
    [sourceOptions, sourcePattern, filter]
  );

  const filteredTargetOptions = useMemo(
    () =>
      targetOptions.filter((option) => filter(targetPattern, option, "target")),
    [targetOptions, targetPattern, filter]
  );

  const handleSourceCheck = useCallback(
    (checkedValues: (string | number)[]) => {
      handleValueChange([...internalValue, ...checkedValues]);
    },
    [internalValue, handleValueChange]
  );

  const handleTargetCheck = useCallback(
    (checkedValues: (string | number)[]) => {
      handleValueChange(
        internalValue.filter((v) => !checkedValues.includes(v))
      );
    },
    [internalValue, handleValueChange]
  );

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const sourceId = result.source.droppableId;
      const destId = result.destination.droppableId;

      if (sourceId === destId) return;

      const itemValue = options.find(
        (opt) => opt.value.toString() === result.draggableId
      )?.value;

      if (itemValue) {
        if (sourceId === "source" && destId === "target") {
          handleValueChange([...internalValue, itemValue]);
        } else if (sourceId === "target" && destId === "source") {
          handleValueChange(internalValue.filter((v) => v !== itemValue));
        }
      }
    },
    [options, internalValue, handleValueChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        <TransferList
          options={filteredSourceOptions}
          checkedOptions={[]}
          onCheck={handleSourceCheck}
          filterable={sourceFilterable}
          filterPlaceholder={sourceFilterPlaceholder}
          title={sourceTitle}
          pattern={sourcePattern}
          onPatternChange={setSourcePattern}
          renderLabel={renderSourceLabel}
          renderList={renderSourceList}
          showSelected={showSelected}
          disabled={disabled}
          size={size}
          virtualScroll={virtualScroll}
          clearText={clearText}
          selectAllText={selectAllText}
          droppableId="source"
        />
        <TransferList
          options={filteredTargetOptions}
          checkedOptions={[]}
          onCheck={handleTargetCheck}
          filterable={targetFilterable}
          filterPlaceholder={targetFilterPlaceholder}
          title={targetTitle}
          pattern={targetPattern}
          onPatternChange={setTargetPattern}
          renderLabel={renderTargetLabel}
          renderList={renderTargetList}
          showSelected={true}
          disabled={disabled}
          size={size}
          virtualScroll={virtualScroll}
          clearText={clearText}
          selectAllText={selectAllText}
          droppableId="target"
        />
      </div>
      <ProgressBar value={targetOptions.length} max={options.length} />
    </DragDropContext>
  );
};

interface TransferListProps {
  options: TransferOption[];
  checkedOptions: TransferOption[];
  onCheck: (checkedValues: (string | number)[]) => void;
  filterable: boolean;
  filterPlaceholder?: string;
  title: string | (() => React.ReactNode);
  pattern: string;
  onPatternChange: (pattern: string) => void;
  renderLabel?: (props: { option: TransferOption }) => React.ReactNode;
  renderList?: (props: {
    onCheck: (checkedValueList: (string | number)[]) => void;
    checkedOptions: TransferOption[];
    pattern: string;
  }) => React.ReactNode;
  showSelected: boolean;
  disabled: boolean;
  size: "small" | "medium" | "large";
  virtualScroll: boolean;
  clearText: string;
  selectAllText: string;
  droppableId: string;
}

const TransferList: React.FC<TransferListProps> = ({
  options,
  checkedOptions,
  onCheck,
  filterable,
  filterPlaceholder,
  title,
  pattern,
  onPatternChange,
  renderLabel,
  renderList,
  showSelected,
  disabled,
  size,
  virtualScroll,
  clearText,
  selectAllText,
  droppableId,
}) => {
  const handleSelectAll = useCallback(() => {
    onCheck(options.map((option) => option.value));
  }, [options, onCheck]);

  const handleClear = useCallback(() => {
    onCheck([]);
  }, [onCheck]);

  const customList = renderList?.({
    onCheck,
    checkedOptions,
    pattern,
  });

  const sizeClass =
    size === "small" ? "text-sm" : size === "large" ? "text-lg" : "text-base";

  return (
    <div className="w-64 bg-white border rounded-md shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">
        {typeof title === "function" ? title() : title}
      </h3>
      {filterable && (
        <div className="mb-2">
          <input
            type="text"
            placeholder={filterPlaceholder}
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {customList || (
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-64 overflow-y-auto list-none p-0"
            >
              <AnimatePresence>
                {options.map((option, index) => (
                  <Draggable
                    key={option.value.toString()}
                    draggableId={option.value.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <motion.li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-1 ${
                          snapshot.isDragging ? "bg-blue-100" : ""
                        }`}
                      >
                        <label className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedOptions.some(
                              (o) => o.value === option.value
                            )}
                            onChange={() => onCheck([option.value])}
                            disabled={disabled || option.disabled}
                            className="mr-2"
                          />
                          <span className={sizeClass}>
                            {renderLabel
                              ? renderLabel({ option })
                              : option.label}
                          </span>
                        </label>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}
      <div className="mt-2 space-x-2">
        <button
          onClick={handleSelectAll}
          disabled={disabled}
          className={`px-3 py-2 bg-blue-500 text-white rounded-md ${sizeClass} ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {selectAllText}
        </button>
        <button
          onClick={handleClear}
          disabled={disabled}
          className={`px-3 py-2 bg-red-500 text-white rounded-md ${sizeClass} ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
        >
          {clearText}
        </button>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-medium text-gray-700">{`${value}/${max}`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};
