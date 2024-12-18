import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  return (
    <>
      <div className="mx-auto dark:bg-gray-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* 左侧：目标列表和过滤器 */}
            <ScrollArea className="md:col-span-3 overflow-y-auto max-h-[calc(100vh-6rem)]">
              <div className="flex flex-col space-y-4">
                {/* 搜索栏 */}
                <Input
                  type="text"
                  placeholder="搜索目标名称..."
                  value={search_query}
                  onChange={(e) => set_search_query(e.target.value)}
                  className="w-full"
                />

                {/* 过滤选项 */}
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterMode.tag}
                    onValueChange={(v) =>
                      setFilterMode((prev) => ({ ...prev, tag: v }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="所有标签" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有标签</SelectItem>
                      {all_tags.map((tag, idx) => (
                        <SelectItem key={idx} value={tag}>
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
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="所有标志" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有标志</SelectItem>
                      {all_flags.map((flag, idx) => (
                        <SelectItem key={idx} value={flag}>
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
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="所有类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类型</SelectItem>
                      {/* 假设有预定义的类型列表 */}
                      <SelectItem value="star">恒星</SelectItem>
                      <SelectItem value="planet">行星</SelectItem>
                      <SelectItem value="galaxy">星系</SelectItem>
                      {/* 更多类型... */}
                    </SelectContent>
                  </Select>
                </div>

                {/* 目标列表 */}
                {filteredTargets.length === 0 ? (
                  <Alert
                    variant="default"
                    className="dark:bg-gray-800 dark:text-gray-200"
                  >
                    拍摄列表中还没有目标
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {filteredTargets.map((one_target_info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full"
                      >
                        <TargetSmallCard
                          target_info={one_target_info}
                          on_card_clicked={on_card_checked}
                          card_index={index}
                          on_choice_maken={props.on_choice_maken}
                          in_manage={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* 右侧：操作面板和统计图表 */}
            <ScrollArea className="space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
              {/* 操作选中的目标 */}
              <Card className="dark:bg-gray-800 dark:text-gray-200">
                <CardHeader className="p-4">
                  <CardTitle>操作选中的目标</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2 p-4">
                  <Button
                    onClick={rename_selected_target}
                    disabled={current_checked == null}
                    className="w-full"
                  >
                    重命名
                  </Button>
                  <Button
                    onClick={on_focus_center_target_clicked}
                    disabled={current_checked == null}
                    className="w-full"
                  >
                    选中的目标进行构图
                  </Button>
                  <Button
                    onClick={on_add_tag_clicked}
                    disabled={current_checked == null}
                    className="w-full"
                  >
                    增加 Tag
                  </Button>
                  <Button
                    onClick={on_add_flag_clicked}
                    disabled={current_checked == null}
                    className="w-full"
                  >
                    增加 Flag
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={on_delete_clicked}
                    disabled={current_checked == null}
                    className="w-full"
                  >
                    删除选中的目标
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportTargets}
                    className="w-full"
                  >
                    导出目标列表
                  </Button>
                </CardContent>
              </Card>

              {/* 数据统计图表 */}
              <Card className="dark:bg-gray-800 dark:text-gray-200">
                <CardHeader className="p-4">
                  <CardTitle>目标统计</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.typeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {chartData.typeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.tagData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 更多功能卡片 */}
              <Card className="dark:bg-gray-800 dark:text-gray-200">
                <CardContent className="p-4">
                  <Button variant="secondary" className="w-full">
                    更多功能
                  </Button>
                </CardContent>
              </Card>
            </ScrollArea>
          </div>
        </motion.div>
      </div>

      {/* 重命名对话框 */}
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
    </>
  );
};

ObjectManagement.defaultProps = {
  on_choice_maken: null,
};

export default ObjectManagement;
