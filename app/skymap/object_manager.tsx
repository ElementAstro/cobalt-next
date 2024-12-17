import * as React from "react";
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

const ObjectManagement: React.FC<ObjectManagementProps> = (props) => {
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
  const [current_checked, set_current_checked] = React.useState<number | null>(
    null
  );
  const [rename_text_dialog, set_rename_text_dialog] = React.useState(false);
  const [rename_text, set_rename_text] = React.useState("");
  const [flag_dialog, set_flag_dialog] = React.useState(false);
  const [flag_text, set_flag_text] = React.useState("");
  const [popup_dialog, set_popup_dialog] = React.useState(false);
  const [popup_text, set_popup_text] = React.useState("");
  const [tag_dialog, set_tag_dialog] = React.useState(false);
  const [tag_value, set_tag_value] = React.useState<string>("");

  // functions
  const on_card_checked = (card_index: number, checked: boolean) => {
    if (checked) {
      log.info(`Checking target at index ${card_index}`);
      clear_all_checked();
      store_check_one_target(card_index);
      set_current_checked(card_index);
    } else {
      log.info('Clearing all checked targets');
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
      log.warn('Attempted to rename with no target selected');
      set_popup_text("没有选中任何待拍摄目标！");
      set_popup_dialog(true);
    }
  };

  const on_add_tag_clicked = () => {
    if (current_checked != null) {
      log.info(`Opening tag dialog for target ${current_checked}`);
      set_tag_dialog(true);
    } else {
      log.warn('Attempted to add tag with no target selected');
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
      log.warn('Attempted to add flag with no target selected');
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
        log.error(`Target ${current_checked} is not checked in store`, target_store[current_checked]);
      }
    } else {
      log.warn('Attempted to delete with no target selected');
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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {target_store.length === 0 ? (
              <Alert variant="default">拍摄列表中还没有目标</Alert>
            ) : (
              target_store.map((one_target_info, index) => (
                <TargetSmallCard
                  key={index}
                  target_info={one_target_info}
                  on_card_clicked={on_card_checked}
                  card_index={index}
                  on_choice_maken={props.on_choice_maken}
                  in_manage={true}
                />
              ))
            )}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>操作选中的目标</CardTitle>
              </CardHeader>
              <CardContent>
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
                  增加tag
                </Button>
                <Button
                  onClick={on_add_flag_clicked}
                  disabled={current_checked == null}
                >
                  增加flag
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
            <Card className="mt-4">
              <CardContent>
                <Button variant="secondary">根据tag筛选</Button>
                <Button variant="secondary">根据flag筛选</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={rename_text_dialog} onOpenChange={set_rename_text_dialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名该目标</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="重命名为"
            value={rename_text}
            onChange={(event) => set_rename_text(event.target.value)}
          />
          <DialogFooter>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改flag</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="flag"
            value={flag_text}
            onChange={(event) => set_flag_text(event.target.value)}
          />
          <DialogFooter>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改目标tag</DialogTitle>
          </DialogHeader>
          <Select value={tag_value} onValueChange={handle_tag_selection}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-</SelectItem>
              {all_tags.map((one_tag, index) => (
                <SelectItem key={index} value={one_tag}>
                  {one_tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handle_tag_close}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={popup_dialog} onOpenChange={set_popup_dialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
          </DialogHeader>
          <div>{popup_text}</div>
          <DialogFooter>
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
