import React, { useState, useMemo, FC } from "react";
import { useGlobalStore } from "@/lib/store/skymap/target";
import TargetSmallCard from "@/components/skymap/target_small";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import log from "@/lib/logger";

interface ObjectManagementProps {
  on_choice_maken: (() => void) | null;
}

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

  const [filterMode, setFilterMode] = useState({
    tag: "all",
    flag: "all",
    type: "all",
  });

  const filteredTargets = useMemo(() => {
    return target_store.filter((target) => {
      if (filterMode.tag !== "all" && target.tag !== filterMode.tag) return false;
      if (filterMode.flag !== "all" && target.flag !== filterMode.flag) return false;
      if (filterMode.type !== "all" && target.type !== filterMode.type) return false;
      return true;
    });
  }, [target_store, filterMode]);

  // functions
  const on_card_checked = (card_index: number, checked: boolean) => {
    if (checked) {
      log.info(`Checking target at index ${card_index}`);
      clear_all_checked();
      store_check_one_target(card_index);
      set_current_checked(card_index);
    } else {
      log.info("Clearing all checked targets");
      clear_all_checked();
      set_current_checked(null);
    }
  };

  const on_focus_center_target_clicked = () => {
    if (current_checked != null) {
      log.info(`Setting focus target to index ${current_checked}`);
      change_saved_focus_target(current_checked.toString());
      if (props.on_choice_maken != null) {
        props.on_choice_maken();
      }
    }
  };

  const rename_selected_target = () => {
    if (current_checked != null) {
      log.info(`Opening rename dialog for target ${current_checked}`);
      set_rename_text("");
      set_rename_text_dialog(true);
    } else {
      log.warn("Attempted to rename with no target selected");
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_add_tag_clicked = () => {
    if (current_checked != null) {
      log.info(`Opening tag dialog for target ${current_checked}`);
      set_tag_dialog(true);
    } else {
      log.warn("Attempted to add tag with no target selected");
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_add_flag_clicked = () => {
    if (current_checked != null) {
      log.info(`Opening flag dialog for target ${current_checked}`);
      set_flag_text("");
      set_flag_dialog(true);
    } else {
      log.warn("Attempted to add flag with no target selected");
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_delete_clicked = () => {
    if (current_checked != null) {
      if (target_store[current_checked].checked) {
        log.info(`Deleting target at index ${current_checked}`);
        remove_one_target(current_checked.toString());
        save_all_targets();
      } else {
        log.error(
          `Target ${current_checked} is not checked in store`,
          target_store[current_checked]
        );
      }
    } else {
      log.warn("Attempted to delete with no target selected");
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const handle_rename_close = (save: boolean) => {
    if (rename_text !== "" && current_checked != null && save) {
      log.info(`Renaming target ${current_checked} to "${rename_text}"`);
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
      log.info(`Setting flag for target ${current_checked} to "${flag_text}"`);
      store_target_set_flag({
        index: current_checked,
        update_string: flag_text,
      });
    }
    set_flag_text("");
    set_flag_dialog(false);
  };

  const handle_tag_selection = (value: string) => {
    log.debug(`Tag selection changed to "${value}"`);
    set_tag_value(value);
  };

  const handle_tag_close = () => {
    if (current_checked != null) {
      log.info(`Setting tag for target ${current_checked} to "${tag_value}"`);
      store_target_set_tag({
        index: current_checked,
        update_string: tag_value,
      });
    }
    set_tag_value("");
    set_tag_dialog(false);
  };

  return (
    <>
      <div className="container mx-auto p-2 sm:p-4 dark:bg-gray-900 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
          <div className="md:col-span-2 overflow-y-auto">
            {filteredTargets.length === 0 ? (
              <Alert variant="default" className="dark:bg-gray-800 dark:text-gray-200">拍摄列表中还没有目标</Alert>
            ) : (
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {filteredTargets.map((one_target_info, index) => (
                  <div key={index} className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5rem)]">
                    <TargetSmallCard
                      target_info={one_target_info}
                      on_card_clicked={on_card_checked}
                      card_index={index}
                      on_choice_maken={props.on_choice_maken}
                      in_manage={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2 sm:space-y-4 overflow-y-auto">
            <Card className="dark:bg-gray-800 dark:text-gray-200">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle>操作选中的目标</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-1 sm:space-y-2 p-3 sm:p-6">
                <Button
                  onClick={rename_selected_target}
                  disabled={current_checked == null}
                >
                  重命名
                </Button>
                <Button
                  onClick={on_focus_center_target_clicked}
                  disabled={current_checked == null}
                >
                  选中的目标进行构图
                </Button>
                <Button
                  onClick={on_add_tag_clicked}
                  disabled={current_checked == null}
                >
                  增加 Tag
                </Button>
                <Button
                  onClick={on_add_flag_clicked}
                  disabled={current_checked == null}
                >
                  增加 Flag
                </Button>
                <Button
                  variant="destructive"
                  onClick={on_delete_clicked}
                  disabled={current_checked == null}
                >
                  删除选中的目标
                </Button>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:text-gray-200">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle>过滤选项</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-4">
                  <Select
                    value={filterMode.tag}
                    onValueChange={(v) =>
                      setFilterMode((prev) => ({ ...prev, tag: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="按 Tag 过滤" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {all_tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
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
                    <SelectTrigger>
                      <SelectValue placeholder="按 Flag 过滤" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {all_flags.map((flag) => (
                        <SelectItem key={flag} value={flag}>
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
                    <SelectTrigger>
                      <SelectValue placeholder="按类型过滤" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="star">恒星</SelectItem>
                      <SelectItem value="planet">行星</SelectItem>
                      <SelectItem value="galaxy">星系</SelectItem>
                      {/* 更多类型可以在这里添加 */}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilterMode({ tag: "all", flag: "all", type: "all" })
                    }
                  >
                    清除过滤
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:text-gray-200">
              <CardContent>
                {/* 可以在这里增加更多的功能按钮或信息展示 */}
                <Button variant="secondary">更多功能</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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

      <Dialog open={flag_dialog} onOpenChange={set_flag_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
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

      <Dialog open={tag_dialog} onOpenChange={set_tag_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle>修改目标 Tag</DialogTitle>
          </DialogHeader>
          <Select value={tag_value} onValueChange={handle_tag_selection}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个 Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-</SelectItem>
              {all_tags.map((one_tag, index) => (
                <SelectItem key={index} value={one_tag}>
                  {one_tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => set_tag_dialog(false)}
            >
              取消
            </Button>
            <Button onClick={handle_tag_close}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={popup_dialog} onOpenChange={set_popup_dialog}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
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