import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Settings, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";
import type { File as CustomFile } from "@/types/filesystem";
import { mockFilesystemApi } from "@/services/mock/filesystem";
import { filesystemApi } from "@/services/api/filesystem";

interface FileCompressionProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles?: CustomFile[];
}

export const FileCompression: React.FC<FileCompressionProps> = ({
  isOpen,
  onClose,
  selectedFiles = [],
}) => {
  const [files, setFiles] = useState<CustomFile[]>(selectedFiles);

  useEffect(() => {
    if (selectedFiles.length) {
      setFiles(selectedFiles);
    }
  }, [selectedFiles]);

  const [compressing, setCompressing] = useState(false);
  const [decompressing, setDecompressing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [includeFolder, setIncludeFolder] = useState(false);
  const [password, setPassword] = useState("");
  const [splitSize, setSplitSize] = useState(0);
  const [compressionAlgorithm, setCompressionAlgorithm] = useState<
    "DEFLATE" | "STORE"
  >("DEFLATE");
  const [fileNameEncoding, setFileNameEncoding] = useState<"UTF-8" | "ASCII">(
    "UTF-8"
  );
  const zipNameRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const customFiles: CustomFile[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      lastModified: new Date(file.lastModified),
      createdAt: new Date(),
      owner: "current-user",
      permissions: "rw",
      path: "/",
      type: "unknown",
      modified: new Date().toISOString(),
    }));

    setFiles((prev) => [...prev, ...customFiles]);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (id: string | number) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const compressFiles = async () => {
    if (files.length === 0) {
      setError("请先上传文件");
      return;
    }

    setCompressing(true);
    setProgress(0);
    setError(null);

    try {
      const zip = new JSZip();
      const api =
        process.env.NEXT_PUBLIC_USE_MOCK === "true"
          ? mockFilesystemApi
          : filesystemApi;

      if (includeFolder) {
        const folder = zip.folder("compressed_files");
        if (!folder) throw new Error("无法创建压缩文件夹");

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // 从后端获取文件数据
          const response = await api.getFileData(file.id.toString());
          if (response.status === "success") {
            folder.file(file.name, response.data);
            setProgress(((i + 1) / files.length) * 50);
          } else {
            throw new Error(`获取文件 ${file.name} 数据失败`);
          }
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // 从后端获取文件数据
          const response = await api.getFileData(file.id.toString());
          if (response.status === "success") {
            zip.file(file.name, response.data);
            setProgress(((i + 1) / files.length) * 50);
          } else {
            throw new Error(`获取文件 ${file.name} 数据失败`);
          }
        }
      }

      const content = await zip.generateAsync({
        type: "blob",
        compression: compressionAlgorithm,
        compressionOptions: {
          level: compressionLevel,
        },
      });

      const url = URL.createObjectURL(content);
      setDownloadUrl(url);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "压缩文件时发生错误");
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  const decompressFiles = async () => {
    if (files.length !== 1 || !files[0].name.endsWith(".zip")) {
      setError("请上传一个ZIP文件");
      return;
    }

    setDecompressing(true);
    setProgress(0);
    setError(null);

    try {
      const zip = new JSZip();
      const file = files[0];

      // 从后端获取 ZIP 文件数据
      const api =
        process.env.NEXT_PUBLIC_USE_MOCK === "true"
          ? mockFilesystemApi
          : filesystemApi;
      const response = await api.getFileData(file.id.toString());

      if (response.status !== "success") {
        throw new Error("获取 ZIP 文件数据失败");
      }

      const content = await zip.loadAsync(response.data);
      const extractedFiles: CustomFile[] = [];

      let processedFiles = 0;
      const totalFiles = Object.keys(content.files).length;

      for (const [filename, zipFile] of Object.entries(content.files)) {
        if (!zipFile.dir) {
          const blob = await zipFile.async("blob");
          extractedFiles.push({
            id: crypto.randomUUID(),
            name: filename,
            size: blob.size,
            lastModified: new Date(),
            createdAt: new Date(),
            owner: "current-user",
            permissions: "rw",
            path: "/",
            type: "unknown",
            modified: new Date().toISOString(),
          });
        }
        processedFiles++;
        setProgress((processedFiles / totalFiles) * 100);
      }

      setFiles(extractedFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "解压文件时发生错误");
      console.error(err);
    } finally {
      setDecompressing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            文件压缩
            {selectedFiles.length > 0 &&
              ` (已选择 ${selectedFiles.length} 个文件)`}
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        <Tabs defaultValue="compress" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compress">压缩</TabsTrigger>
            <TabsTrigger value="decompress">解压</TabsTrigger>
          </TabsList>
          <TabsContent value="compress">
            <div className="p-6 bg-white rounded-lg shadow-md">
              {selectedFiles.length > 0 ? (
                <motion.div className="mb-4">
                  <h3 className="font-semibold mb-2">已选择的文件:</h3>
                  <ul className="list-disc pl-5">
                    {selectedFiles.map((file) => (
                      <li key={file.id} className="flex justify-between">
                        {file.name}
                        <X
                          className="cursor-pointer"
                          onClick={() => removeFile(file.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  {...(getRootProps() as any)}
                  className={`p-10 border-2 border-dashed rounded-md text-center cursor-pointer 
                    ${isDragActive ? "border-primary" : "border-gray-300"}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>将文件拖放到这里 ...</p>
                  ) : (
                    <p>拖放文件到这里, 或点击选择文件</p>
                  )}
                </motion.div>
              )}

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <h3 className="font-semibold">已选择的文件:</h3>
                    <ul className="list-disc pl-5">
                      {files.map((file, index) => (
                        <li key={index} className="flex justify-between">
                          {file.name}
                          <X
                            className="cursor-pointer"
                            onClick={() => removeFile(index)}
                          />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={compressFiles}
                  disabled={compressing || files.length === 0}
                  className="flex-1 mr-2"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      压缩中...
                    </>
                  ) : (
                    "压缩文件"
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>压缩设置</DialogTitle>
                      <div className="grid gap-4 py-4">
                        <Label htmlFor="compression-level">压缩级别</Label>
                        <Input
                          id="compression-level"
                          type="number"
                          value={compressionLevel}
                          onChange={(e) =>
                            setCompressionLevel(Number(e.target.value))
                          }
                          min={0}
                          max={9}
                        />
                        <Label htmlFor="include-folder">包含文件夹</Label>
                        <Input
                          id="include-folder"
                          type="checkbox"
                          checked={includeFolder}
                          onChange={(e) => setIncludeFolder(e.target.checked)}
                        />
                        <Label htmlFor="compression-algorithm">算法</Label>
                        <Select
                          value={compressionAlgorithm}
                          onValueChange={(value) =>
                            setCompressionAlgorithm(
                              value as "DEFLATE" | "STORE"
                            )
                          }
                        >
                          <SelectTrigger id="compression-algorithm">
                            <SelectValue placeholder="选择算法" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DEFLATE">DEFLATE</SelectItem>
                            <SelectItem value="STORE">STORE</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label htmlFor="file-name-encoding">文件名编码</Label>
                        <Select
                          value={fileNameEncoding}
                          onValueChange={(value) =>
                            setFileNameEncoding(value as "UTF-8" | "ASCII")
                          }
                        >
                          <SelectTrigger id="file-name-encoding">
                            <SelectValue placeholder="选择编码" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTF-8">UTF-8</SelectItem>
                            <SelectItem value="ASCII">ASCII</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label htmlFor="split-size">分割大小 (MB)</Label>
                        <Input
                          id="split-size"
                          type="number"
                          value={splitSize}
                          onChange={(e) => setSplitSize(Number(e.target.value))}
                          min={0}
                        />
                        <Label htmlFor="zip-name">ZIP 名称</Label>
                        <Input
                          id="zip-name"
                          ref={zipNameRef}
                          type="text"
                          placeholder="压缩文件名"
                        />
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              {compressing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Progress value={progress} className="mt-2" />
                </motion.div>
              )}

              <AnimatePresence>
                {downloadUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <a
                      href={downloadUrl}
                      download={`${
                        zipNameRef.current?.value || "compressed"
                      }.zip`}
                      className="mt-4 w-full inline-block"
                      onClick={() => {
                        // Revoke URL after download to free memory
                        setTimeout(() => {
                          URL.revokeObjectURL(downloadUrl);
                          setDownloadUrl(null);
                        }, 1000);
                      }}
                    >
                      <Button className="w-full">下载压缩文件</Button>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          <TabsContent value="decompress">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <motion.div
                onClick={getRootProps().onClick}
                onKeyDown={getRootProps().onKeyDown}
                onFocus={getRootProps().onFocus}
                onBlur={getRootProps().onBlur}
                className={`p-10 border-2 border-dashed rounded-md text-center cursor-pointer 
                  ${isDragActive ? "border-primary" : "border-gray-300"}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input {...getInputProps()} accept=".zip" />
                {isDragActive ? (
                  <p>将ZIP文件拖放到这里 ...</p>
                ) : (
                  <p>拖放ZIP文件到这里, 或点击选择文件</p>
                )}
              </motion.div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <h3 className="font-semibold">已选择的文件:</h3>
                    <ul className="list-disc pl-5">
                      {files.map((file, index) => (
                        <li key={index} className="flex justify-between">
                          {file.name}
                          <X
                            className="cursor-pointer"
                            onClick={() => removeFile(index)}
                          />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col space-y-4 mt-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码（如果需要）"
                />
                <Button
                  onClick={decompressFiles}
                  disabled={decompressing || files.length === 0}
                  className="w-full"
                >
                  {decompressing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      解压中...
                    </>
                  ) : (
                    "解压文件"
                  )}
                </Button>
              </div>

              {decompressing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Progress value={progress} className="mt-2" />
                </motion.div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
