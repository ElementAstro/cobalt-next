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
import { motion } from "framer-motion";
import TargetSmallCard from "@/components/skymap/target_small";
import { useGlobalStore } from "@/lib/store/skymap/target";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ObjectManagementProps {
  on_choice_maken: (() => void) | null;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ObjectManagement: FC<ObjectManagementProps> = (props) => {
  // store handler
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

  // data
  const [current_checked, set_current_checked] = useState<number | null>(null);
  const [rename_text_dialog, set_rename_text_dialog] = useState(false);
  const [rename_text, set_rename_text] = useState("");
  const [flag_dialog, set_flag_dialog] = useState(false);
  const [flag_text, set_flag_text] = useState("");
  const [popup_dialog, set_popup_dialog] = useState(false);
  const [popup_text, set_popup_text] = useState("");
  const [tag_dialog, set_tag_dialog] = useState(false);
  const [tag_value, set_tag_value] = useState<string>("");
  const [search_query, set_search_query] = useState<string>("");

  const [filterMode, setFilterMode] = useState({
    tag: "all",
    flag: "all",
    type: "all",
  });

  const filteredTargets = useMemo(() => {
    return target_store.filter((target) => {
      if (filterMode.tag !== "all" && target.tag !== filterMode.tag)
        return false;
      if (filterMode.flag !== "all" && target.flag !== filterMode.flag)
        return false;
      if (filterMode.type !== "all" && target.type !== filterMode.type)
        return false;
      if (search_query && !target.name.includes(search_query)) return false;
      return true;
    });
  }, [target_store, filterMode, search_query]);

  // 图表数据
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

  // functions
  const on_card_checked = useCallback(
    (card_index: number, checked: boolean) => {
      if (checked) {
        clear_all_checked();
        store_check_one_target(card_index);
        set_current_checked(card_index);
      } else {
        clear_all_checked();
        set_current_checked(null);
      }
    },
    [clear_all_checked, store_check_one_target]
  );

  const on_focus_center_target_clicked = () => {
    if (current_checked != null) {
      change_saved_focus_target(current_checked.toString());
      if (props.on_choice_maken != null) {
        props.on_choice_maken();
      }
    }
  };

  const rename_selected_target = () => {
    if (current_checked != null) {
      set_rename_text("");
      set_rename_text_dialog(true);
    } else {
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_add_tag_clicked = () => {
    if (current_checked != null) {
      set_tag_dialog(true);
    } else {
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_add_flag_clicked = () => {
    if (current_checked != null) {
      set_flag_dialog(true);
    } else {
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_delete_clicked = () => {
    if (current_checked != null) {
      if (target_store[current_checked].checked) {
        remove_one_target(current_checked.toString());
        save_all_targets();
      } else {
        set_popup_text("目标未被选中！");
        set_popup_dialog(true);
      }
    } else {
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const handle_rename_close = (save: boolean) => {
    if (rename_text !== "" && current_checked != null && save) {
      store_target_rename({
        index: current_checked,
        update_string: rename_text,
      });
    }
    set_rename_text("");
    set_rename_text_dialog(false);
  };

  const handle_flag_close = (save: boolean) => {
    if (flag_text !== "" && current_checked != null && save) {
      store_target_set_flag({
        index: current_checked,
        update_string: flag_text,
      });
    }
    set_flag_text("");
    set_flag_dialog(false);
  };

  const handle_tag_selection = (value: string) => {
    set_tag_value(value);
  };

  const handle_tag_close = () => {
    if (current_checked != null && tag_value !== "all") {
      store_target_set_tag({
        index: current_checked,
        update_string: tag_value,
      });
      set_tag_value("");
      set_tag_dialog(false);
    } else {
      set_popup_text("请选择一个有效的 Tag！");
      set_popup_dialog(true);
    }
  };

  const exportTargets = () => {
    const data = target_store.map((target) => ({
      name: target.name,
      type: target.type,
      tag: target.tag,
      flag: target.flag,
      // 添加更多字段如果需要
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

  // 在组件内添加新的状态
  const [batchMode, setBatchMode] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"name" | "type" | "tag" | "flag">(
    "name"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 添加批量操作功能
  const handleBatchDelete = useCallback(() => {
    selectedTargets.forEach((index) => {
      remove_one_target(index.toString());
    });
    save_all_targets();
    setSelectedTargets([]);
    setBatchMode(false);
  }, [selectedTargets, remove_one_target, save_all_targets]);

  // 添加排序功能
  const sortedTargets = useMemo(() => {
    return [...filteredTargets].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const valueA = aValue || "";
      const valueB = bValue || "";
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [filteredTargets, sortOrder, sortField]);

  return (
    <div className="flex h-[80vh] gap-4 p-4 rounded-lg">
      {/* 左侧过滤器面板 */}
      <Card className="w-64 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>过滤器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="搜索目标名称..."
            value={search_query}
            onChange={(e) => set_search_query(e.target.value)}
          />
          
          <div className="space-y-2">
            <Select
              value={filterMode.tag}
              onValueChange={(v) => setFilterMode((prev) => ({ ...prev, tag: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="标签筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标签</SelectItem>
                {all_tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterMode.flag}
              onValueChange={(v) => setFilterMode((prev) => ({ ...prev, flag: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="标记筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标记</SelectItem>
                {all_flags.map((flag) => (
                  <SelectItem key={flag} value={flag}>{flag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterMode.type}
              onValueChange={(v) => setFilterMode((prev) => ({ ...prev, type: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="star">恒星</SelectItem>
                <SelectItem value="planet">行星</SelectItem>
                <SelectItem value="galaxy">星系</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setBatchMode(!batchMode)}
            >
              {batchMode ? "退出批量" : "批量操作"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={exportTargets}
            >
              导出列表
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <div className="flex-1 space-y-4">
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>目标列表</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? "列表视图" : "网格视图"}
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
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(80vh-8rem)]">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedTargets.map((target, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TargetSmallCard
                        target_info={target}
                        on_card_clicked={on_card_checked}
                        card_index={index}
                        on_choice_maken={props.on_choice_maken}
                        in_manage={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedTargets.map((target, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="dark:bg-gray-800">
                        <CardHeader className="p-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">
                              {target.name}
                            </CardTitle>
                            <div className="flex gap-2">
                              {batchMode && (
                                <Checkbox
                                  checked={selectedTargets.includes(index)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTargets([
                                        ...selectedTargets,
                                        index,
                                      ]);
                                    } else {
                                      setSelectedTargets(
                                        selectedTargets.filter(
                                          (i) => i !== index
                                        )
                                      );
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 批量操作的工具栏 */}
      {batchMode && selectedTargets.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700"
        >
          <div className="container mx-auto flex justify-between items-center">
            <span>已选择 {selectedTargets.length} 个目标</span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setSelectedTargets([])}>
                取消选择
              </Button>
              <Button variant="destructive" onClick={handleBatchDelete}>
                批量删除
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 现有的对话框保持不变 */}
      <Dialog open={rename_text_dialog} onOpenChange={set_rename_text_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-lg p-4">
          <DialogHeader>
            <DialogTitle>重命名该目标</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="重命名为"
            value={rename_text}
            onChange={(event) => set_rename_text(event.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => handle_rename_close(false)}
            >
              取消
            </Button>
            <Button onClick={() => handle_rename_close(true)}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag 对话框 */}
      <Dialog open={flag_dialog} onOpenChange={set_flag_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-md p-4">
          <DialogHeader>
            <DialogTitle>修改 Flag</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Flag"
            value={flag_text}
            onChange={(event) => set_flag_text(event.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => handle_flag_close(false)}
            >
              取消
            </Button>
            <Button onClick={() => handle_flag_close(true)}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag 对话框 */}
      <Dialog open={tag_dialog} onOpenChange={set_tag_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-md p-4">
          <DialogHeader>
            <DialogTitle>修改目标 Tag</DialogTitle>
          </DialogHeader>
          <Select value={tag_value} onValueChange={handle_tag_selection}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个 Tag" />
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
            <Button variant="secondary" onClick={() => set_tag_dialog(false)}>
              取消
            </Button>
            <Button onClick={handle_tag_close}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提示对话框 */}
      <Dialog open={popup_dialog} onOpenChange={set_popup_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200 w-[90%] max-w-sm p-4">
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{popup_text}</div>
          <DialogFooter className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => set_popup_dialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ObjectManagement.defaultProps = {
  on_choice_maken: null,
};

export default ObjectManagement;
