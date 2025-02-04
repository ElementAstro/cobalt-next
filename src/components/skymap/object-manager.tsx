"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  List,
  Grid,
  Filter,
  SortAsc,
  SortDesc,
  Trash2,
  X,
  Download,
  Sliders,
  Star,
  Globe,
  Sparkles,
  Search,
  Flag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TargetSmallCard from "./target-small";
import { useGlobalStore } from "@/store/useSkymapStore";
import { IDSOFramingObjectInfo, IDSOObjectDetailedInfo } from "@/types/skymap";

interface ObjectManagementProps {
  on_choice_maken: (() => void) | null;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// FilterPanel Component
const FilterPanel: FC<{
  filterMode: FilterMode;
  setFilterMode: React.Dispatch<React.SetStateAction<FilterMode>>;
  all_tags: string[];
  all_flags: string[];
  onBatchMode: () => void;
  onExportAll: () => void;
}> = ({ filterMode, setFilterMode, all_tags, all_flags, onBatchMode, onExportAll }) => {
  return (
    <Card className="w-64 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>过滤器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="搜索目标名称..."
            value={filterMode.search_query}
            onChange={(e) =>
              setFilterMode((prev) => ({
                ...prev,
                search_query: e.target.value,
              }))
            }
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Select
            value={filterMode.tag}
            onValueChange={(v) =>
              setFilterMode((prev) => ({ ...prev, tag: v }))
            }
          >
            <SelectTrigger className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="标签筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                所有标签
              </SelectItem>
              {all_tags.map((tag) => (
                <SelectItem
                  key={tag}
                  value={tag}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterMode.flag}
            onValueChange={(v) =>
              setFilterMode((prev) => ({ ...prev, flag: v }))
            }
          >
            <SelectTrigger className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <SelectValue placeholder="标记筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                所有标记
              </SelectItem>
              {all_flags.map((flag) => (
                <SelectItem
                  key={flag}
                  value={flag}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  {flag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterMode.type}
            onValueChange={(v) =>
              setFilterMode((prev) => ({ ...prev, type: v }))
            }
          >
            <SelectTrigger className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <SelectValue placeholder="类型筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                所有类型
              </SelectItem>
              <SelectItem value="star" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                恒星
              </SelectItem>
              <SelectItem value="planet" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                行星
              </SelectItem>
              <SelectItem value="galaxy" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                星系
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={onBatchMode}
          >
            <List className="w-4 h-4" />
            批量操作
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={onExportAll}
          >
            <Download className="w-4 h-4" />
            导出全部
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// TargetList Component
const TargetList: FC<{
  targets: IDSOFramingObjectInfo[];
  viewMode: "grid" | "list";
  batchMode: boolean;
  selectedTargets: number[];
  setSelectedTargets: React.Dispatch<React.SetStateAction<number[]>>;
  onCardChecked: (index: number, checked: boolean) => void;
  onChoiceMaken: (() => void) | null;
}> = ({
  targets,
  viewMode,
  batchMode,
  selectedTargets,
  setSelectedTargets,
  onCardChecked,
  onChoiceMaken,
}) => {
  return (
    <ScrollArea className="h-[calc(80vh-8rem)]">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {targets.map((target, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
              }}
              className="cursor-pointer"
            >
              <TargetSmallCard
                target_info={target}
                on_card_clicked={onCardChecked}
                card_index={index}
                on_choice_maken={onChoiceMaken}
                in_manage={true}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {targets.map((target, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
              }}
              className="cursor-pointer"
            >
              <Card className="dark:bg-gray-800">
                <CardHeader className="p-3 flex justify-between items-center">
                  <CardTitle className="text-sm">{target.name}</CardTitle>
                  {batchMode && (
                    <Checkbox
                      checked={selectedTargets.includes(index)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTargets([...selectedTargets, index]);
                        } else {
                          setSelectedTargets(
                            selectedTargets.filter((i) => i !== index)
                          );
                        }
                      }}
                    />
                  )}
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

// BatchOperationToolbar Component
const BatchOperationToolbar: FC<{
  selectedCount: number;
  onCancel: () => void;
  onBatchDelete: () => void;
  onBatchExport: () => void;
  onBatchUpdateTag: () => void;
  onBatchUpdateFlag: () => void;
  onFocusTarget: () => void;
}> = ({
  selectedCount,
  onCancel,
  onBatchDelete,
  onBatchExport,
  onBatchUpdateTag,
  onBatchUpdateFlag,
  onFocusTarget,
}) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700"
    >
      <div className="container mx-auto flex justify-between items-center">
        <span>已选择 {selectedCount} 个目标</span>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            取消选择
          </Button>
          {selectedCount === 1 && (
            <Button variant="outline" onClick={onFocusTarget}>
              <Search className="w-4 h-4 mr-2" />
              聚焦目标
            </Button>
          )}
          <Button variant="outline" onClick={onBatchUpdateTag}>
            <Star className="w-4 h-4 mr-2" />
            批量标签
          </Button>
          <Button variant="outline" onClick={onBatchUpdateFlag}>
            <Flag className="w-4 h-4 mr-2" />
            批量标记
          </Button>
          <Button variant="outline" onClick={onBatchExport}>
            <Download className="w-4 h-4 mr-2" />
            导出选中
          </Button>
          <Button variant="destructive" onClick={onBatchDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            批量删除
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

interface FilterMode {
  tag: string;
  flag: string;
  type: string;
  search_query: string;
}

const ObjectManagement: FC<ObjectManagementProps> = (props) => {
  // Store handler
  const target_store = useGlobalStore((state) => state.targets);
  const clear_all_checked = useGlobalStore((state) => state.clearAllChecked);
  const remove_one_target = useGlobalStore((state) => state.removeTarget);
  const save_all_targets = useGlobalStore((state) => state.saveAllTargets);
  const change_saved_focus_target = useGlobalStore(
    (state) => state.setFocusTarget
  );
  const store_target_set_flag = useGlobalStore((state) => state.setTargetFlag);
  const store_target_set_tag = useGlobalStore((state) => state.setTargetTag);
  const store_target_rename = useGlobalStore((state) => state.renameTarget);
  const store_check_one_target = useGlobalStore(
    (state) => state.checkOneTarget
  );
  const all_tags = useGlobalStore((state) => state.all_tags);
  const all_flags = useGlobalStore((state) => state.all_flags);

  // Data
  const [filterMode, setFilterMode] = useState<FilterMode>({
    tag: "all",
    flag: "all",
    type: "all",
    search_query: "",
  });

  const [renameTextDialog, setRenameTextDialog] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [flagDialog, setFlagDialog] = useState(false);
  const [flagText, setFlagText] = useState("");
  const [popupDialog, setPopupDialog] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [tagDialog, setTagDialog] = useState(false);
  const [tagValue, setTagValue] = useState<string>("");

  // Batch operation state
  const [batchMode, setBatchMode] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<number[]>([]);

  // View and sorting state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"name" | "type" | "tag" | "flag">(
    "name"
  );

  // Filtered and sorted targets
  const filteredTargets = useMemo(() => {
    return target_store
      .filter((target) => {
        if (filterMode.tag !== "all" && target.tag !== filterMode.tag)
          return false;
        if (filterMode.flag !== "all" && target.flag !== filterMode.flag)
          return false;
        if (filterMode.type !== "all" && target.type !== filterMode.type)
          return false;
        if (
          filterMode.search_query &&
          !target.name.includes(filterMode.search_query)
        )
          return false;
        return true;
      })
      .map((target) => ({
        ...target,
        type: target.type || "",
      }));
  }, [target_store, filterMode]);

  const sortedTargets = useMemo(() => {
    return [...filteredTargets].sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredTargets, sortOrder, sortField]);

  // Chart data (if needed for future enhancements)
  const chartData = useMemo(() => {
    const typeCount: { [key: string]: number } = {};
    const tagCount: { [key: string]: number } = {};
    const flagCount: { [key: string]: number } = {};

    target_store.forEach((target) => {
      if (target.type) {
        typeCount[target.type] = (typeCount[target.type] || 0) + 1;
      }
      tagCount[target.tag] = (tagCount[target.tag] || 0) + 1;
      flagCount[target.flag] = (flagCount[target.flag] || 0) + 1;
    });

    const typeData = Object.keys(typeCount).map((key) => ({
      name: key,
      value: typeCount[key],
    }));

    const tagData = Object.keys(tagCount).map((key) => ({
      name: key,
      value: tagCount[key],
    }));

    const flagData = Object.keys(flagCount).map((key) => ({
      name: key,
      value: flagCount[key],
    }));

    return { typeData, tagData, flagData };
  }, [target_store]);

  // Functions
  const onCardChecked = useCallback(
    (card_index: number, checked: boolean) => {
      if (checked) {
        clear_all_checked();
        store_check_one_target(card_index);
        setSelectedTargets([card_index]);
      } else {
        clear_all_checked();
        setSelectedTargets([]);
      }
    },
    [clear_all_checked, store_check_one_target]
  );

  const onFocusCenterTargetClicked = () => {
    if (selectedTargets.length === 1) {
      change_saved_focus_target(selectedTargets[0].toString());
      if (props.on_choice_maken) {
        props.on_choice_maken();
      }
    } else {
      setPopupText("请选择一个单一的目标进行聚焦！");
      setPopupDialog(true);
    }
  };

  const renameSelectedTarget = () => {
    if (selectedTargets.length === 1) {
      setRenameText("");
      setRenameTextDialog(true);
    } else {
      setPopupText("请先选择一个目标进行重命名！");
      setPopupDialog(true);
    }
  };

  const addTagToSelectedTarget = () => {
    if (selectedTargets.length === 1) {
      setTagDialog(true);
    } else {
      setPopupText("请先选择一个目标添加标签！");
      setPopupDialog(true);
    }
  };

  const addFlagToSelectedTarget = () => {
    if (selectedTargets.length === 1) {
      setFlagDialog(true);
    } else {
      setPopupText("请先选择一个目标添加标记！");
      setPopupDialog(true);
    }
  };

  const deleteSelectedTargets = () => {
    if (selectedTargets.length > 0) {
      selectedTargets.forEach((index) => {
        remove_one_target(index.toString());
      });
      save_all_targets();
      setSelectedTargets([]);
      setBatchMode(false);
    } else {
      setPopupText("没有选中任何目标进行删除！");
      setPopupDialog(true);
    }
  };

  const handleRenameClose = (save: boolean) => {
    if (save && renameText !== "" && selectedTargets.length === 1) {
      store_target_rename({
        index: selectedTargets[0],
        update_string: renameText,
      });
    }
    setRenameText("");
    setRenameTextDialog(false);
  };

  const handleFlagClose = (save: boolean) => {
    if (save && flagText !== "" && selectedTargets.length === 1) {
      store_target_set_flag({
        index: selectedTargets[0],
        update_string: flagText,
      });
    }
    setFlagText("");
    setFlagDialog(false);
  };

  const handleTagSelection = (value: string) => {
    setTagValue(value);
  };

  const handleTagClose = () => {
    if (tagValue !== "all" && selectedTargets.length === 1) {
      store_target_set_tag({
        index: selectedTargets[0],
        update_string: tagValue,
      });
      setTagValue("");
      setTagDialog(false);
    } else {
      setPopupText("请选择一个有效的标签！");
      setPopupDialog(true);
    }
  };

  const exportTargets = () => {
    const data = target_store.map((target) => ({
      name: target.name,
      type: target.type,
      tag: target.tag,
      flag: target.flag,
    }));
    const csvContent = `data:text/csv;charset=utf-8,${[
      "Name",
      "Type",
      "Tag",
      "Flag",
    ].join(",")}\n${data
      .map((t) => `${t.name},${t.type},${t.tag},${t.flag}`)
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "targets_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchDelete = useCallback(() => {
    deleteSelectedTargets();
  }, [deleteSelectedTargets]);

  const handleCancelSelection = () => {
    setSelectedTargets([]);
    setBatchMode(false);
    clear_all_checked();
  };

  const exportSelectedTargets = () => {
    if (selectedTargets.length === 0) {
      setPopupText("请先选择要导出的目标！");
      setPopupDialog(true);
      return;
    }

    const selectedData = selectedTargets.map((index) => {
      const target = target_store[index];
      return {
        name: target.name,
        ra: target.ra,
        dec: target.dec,
        type: target.target_type,
        tag: target.tag,
        flag: target.flag,
        rotation: target.rotation,
        size: target.size,
      };
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,RA,Dec,Type,Tag,Flag,Rotation,Size\n" +
      selectedData
        .map(
          (row) =>
            `${row.name},${row.ra},${row.dec},${row.type},${row.tag},${row.flag},${row.rotation},${row.size}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `target_export_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const batchUpdateTags = (newTag: string) => {
    if (selectedTargets.length === 0) {
      setPopupText("请先选择要更新的目标！");
      setPopupDialog(true);
      return;
    }

    selectedTargets.forEach((index) => {
      store_target_set_tag({
        index,
        update_string: newTag,
      });
    });

    save_all_targets();
    setTagDialog(false);
    setSelectedTargets([]);
    setBatchMode(false);
  };

  const batchUpdateFlags = (newFlag: string) => {
    if (selectedTargets.length === 0) {
      setPopupText("请先选择要更新的目标！");
      setPopupDialog(true);
      return;
    }

    selectedTargets.forEach((index) => {
      store_target_set_flag({
        index,
        update_string: newFlag,
      });
    });

    save_all_targets();
    setFlagDialog(false);
    setSelectedTargets([]);
    setBatchMode(false);
  };

  // 添加批量模式切换函数
  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    if(!batchMode) {
      setSelectedTargets([]);
      clear_all_checked();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[80vh] gap-4 p-4 rounded-lg dark:bg-gray-900">
      {/* 左侧过滤器面板 */}
      <FilterPanel
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        all_tags={all_tags}
        all_flags={all_flags}
        onBatchMode={toggleBatchMode}
        onExportAll={exportTargets}
      />

      {/* 主要内容区域 */}
      <div className="flex-1 space-y-4">
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>目标列表</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    列表视图
                  </>
                ) : (
                  <>
                    <Grid className="w-4 h-4 mr-2" />
                    网格视图
                  </>
                )}
              </Button>
              <Select
                value={sortField}
                onValueChange={(value: any) => setSortField(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">名称</SelectItem>
                  <SelectItem value="type">类型</SelectItem>
                  <SelectItem value="tag">标签</SelectItem>
                  <SelectItem value="flag">标记</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TargetList
              targets={sortedTargets}
              viewMode={viewMode}
              batchMode={batchMode}
              selectedTargets={selectedTargets}
              setSelectedTargets={setSelectedTargets}
              onCardChecked={onCardChecked}
              onChoiceMaken={props.on_choice_maken}
            />
          </CardContent>
        </Card>
      </div>

      {/* 批量操作的工具栏 */}
      {batchMode && selectedTargets.length > 0 && (
        <BatchOperationToolbar
          selectedCount={selectedTargets.length}
          onCancel={handleCancelSelection}
          onBatchDelete={handleBatchDelete}
          onBatchExport={exportSelectedTargets}
          onBatchUpdateTag={() => setTagDialog(true)}
          onBatchUpdateFlag={() => setFlagDialog(true)}
          onFocusTarget={onFocusCenterTargetClicked}
        />
      )}

      {/* 对话框组件 */}
      {/* Rename Dialog */}
      <Dialog open={renameTextDialog} onOpenChange={setRenameTextDialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-lg p-4">
          <DialogHeader>
            <DialogTitle>重命名该目标</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="重命名为"
            value={renameText}
            onChange={(event) => setRenameText(event.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => handleRenameClose(false)}
            >
              取消
            </Button>
            <Button onClick={() => handleRenameClose(true)}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={flagDialog} onOpenChange={setFlagDialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-md p-4">
          <DialogHeader>
            <DialogTitle>修改 Flag</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Flag"
            value={flagText}
            onChange={(event) => setFlagText(event.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => handleFlagClose(false)}>
              取消
            </Button>
            <Button onClick={() => handleFlagClose(true)}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={tagDialog} onOpenChange={setTagDialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-md p-4">
          <DialogHeader>
            <DialogTitle>修改目标 Tag</DialogTitle>
          </DialogHeader>
          <Select value={tagValue} onValueChange={handleTagSelection}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有标签</SelectItem>
              {all_tags.map((one_tag, index) => (
                <SelectItem key={index} value={one_tag}>
                  {one_tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setTagDialog(false)}>
              取消
            </Button>
            <Button onClick={handleTagClose}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup Dialog */}
      <Dialog open={popupDialog} onOpenChange={setPopupDialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-sm p-4">
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{popupText}</div>
          <DialogFooter className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => setPopupDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectManagement;
