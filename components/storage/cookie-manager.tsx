"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Cookie {
  name: string;
  value: string;
  selected?: boolean;
}

interface CookieManagerProps {
  isLandscape: boolean;
}

export function CookieManager({ isLandscape }: CookieManagerProps) {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [newCookie, setNewCookie] = useState<Cookie>({ name: "", value: "" });
  const [editCookie, setEditCookie] = useState<Cookie | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadCookies();
  }, []);

  const loadCookies = () => {
    const allCookies = document.cookie.split(";").map((cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      return { name, value, selected: false };
    });
    setCookies(allCookies);
  };

  const addCookie = () => {
    document.cookie = `${newCookie.name}=${newCookie.value}`;
    setNewCookie({ name: "", value: "" });
    loadCookies();
    toast({
      title: "Cookie Added",
      description: `Cookie "${newCookie.name}" has been added successfully.`,
    });
  };

  const updateCookie = () => {
    if (editCookie) {
      document.cookie = `${editCookie.name}=${editCookie.value}`;
      setEditCookie(null);
      loadCookies();
      toast({
        title: "Cookie Updated",
        description: `Cookie "${editCookie.name}" has been updated successfully.`,
      });
    }
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    loadCookies();
    toast({
      title: "Cookie Deleted",
      description: `Cookie "${name}" has been deleted successfully.`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setCookies(cookies.map((cookie) => ({ ...cookie, selected: checked })));
  };

  const handleSelect = (name: string, checked: boolean) => {
    setCookies(
      cookies.map((cookie) =>
        cookie.name === name ? { ...cookie, selected: checked } : cookie
      )
    );
  };

  const deleteSelected = () => {
    cookies.forEach((cookie) => {
      if (cookie.selected) {
        deleteCookie(cookie.name);
      }
    });
    setSelectAll(false);
  };

  const exportCookies = () => {
    const selectedCookies = cookies.filter((cookie) => cookie.selected);
    const cookieData = JSON.stringify(selectedCookies, null, 2);
    const blob = new Blob([cookieData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookies.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Cookies Exported",
      description: `${selectedCookies.length} cookies have been exported successfully.`,
    });
  };

  return (
    <div className={`space-y-4 ${isLandscape ? "landscape-layout" : ""}`}>
      <h2 className="text-2xl font-bold">Cookie Manager</h2>
      <div
        className={`flex ${
          isLandscape ? "flex-col" : "flex-row"
        } space-y-2 md:space-y-0 md:space-x-2`}
      >
        <Input
          placeholder="Cookie Name"
          value={newCookie.name}
          onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
          aria-label="Cookie Name"
          className={isLandscape ? "w-full" : "w-1/3"}
        />
        <Input
          placeholder="Cookie Value"
          value={newCookie.value}
          onChange={(e) =>
            setNewCookie({ ...newCookie, value: e.target.value })
          }
          aria-label="Cookie Value"
          className={isLandscape ? "w-full" : "w-1/3"}
        />
        <Button
          onClick={addCookie}
          className={isLandscape ? "w-full" : "w-1/3"}
        >
          Add Cookie
        </Button>
      </div>
      <div
        className={`flex ${
          isLandscape ? "flex-col" : "justify-between"
        } items-center space-y-2 md:space-y-0`}
      >
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all">Select All</label>
        </div>
        <div
          className={`flex ${
            isLandscape ? "flex-col w-full" : "flex-row"
          } space-y-2 md:space-y-0 md:space-x-2`}
        >
          <Button
            onClick={deleteSelected}
            variant="destructive"
            disabled={!cookies.some((c) => c.selected)}
            className={isLandscape ? "w-full" : ""}
          >
            Delete Selected
          </Button>
          <Button
            onClick={exportCookies}
            disabled={!cookies.some((c) => c.selected)}
            className={isLandscape ? "w-full" : ""}
          >
            Export Selected
          </Button>
        </div>
      </div>
      <div
        className={`overflow-x-auto ${isLandscape ? "landscape-table" : ""}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookies.map((cookie) => (
              <TableRow key={cookie.name}>
                <TableCell>
                  <Checkbox
                    checked={cookie.selected}
                    onCheckedChange={(checked) =>
                      handleSelect(cookie.name, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>{cookie.name}</TableCell>
                <TableCell>{cookie.value}</TableCell>
                <TableCell>
                  <div
                    className={`flex ${
                      isLandscape ? "flex-col" : "flex-row"
                    } space-y-2 md:space-y-0 md:space-x-2`}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setEditCookie(cookie)}
                          className={isLandscape ? "w-full" : ""}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Cookie</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={editCookie?.name}
                              className="col-span-3"
                              onChange={(e) =>
                                setEditCookie({
                                  ...editCookie!,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                              Value
                            </Label>
                            <Input
                              id="value"
                              value={editCookie?.value}
                              className="col-span-3"
                              onChange={(e) =>
                                setEditCookie({
                                  ...editCookie!,
                                  value: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={updateCookie}>Update Cookie</Button>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => deleteCookie(cookie.name)}
                      className={isLandscape ? "w-full" : ""}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
