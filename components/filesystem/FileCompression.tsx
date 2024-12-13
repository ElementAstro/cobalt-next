import React, { useState, useRef, useCallback } from "react";
import { X, Settings, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
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
import {
  Tabs,
  TabsList,
  TabsTrigger as TabTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";
// Removed unused imports: Archive, FileUp
// import { useFileCompression } from "@/lib/store/filesystem"; // Uncomment if needed

interface FileCompressionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileCompression: React.FC<FileCompressionProps> = ({
  isOpen,
  onClose,
}) => {
  // Removed unused variables from useFileCompression
  // const {
  //   selectedFiles,
  //   compressionType,
  //   isCompressing,
  //   setSelectedFiles,
  //   setCompressionType,
  //   setIsCompressing,
  // } = useFileCompression();

  const [files, setFiles] = useState<File[]>([]); // Initialized as empty array
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
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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

      if (includeFolder) {
        const folder = zip.folder("compressed_files");
        if (!folder) throw new Error("无法创建压缩文件夹");
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          folder.file(file.name, arrayBuffer);
          setProgress(((i + 1) / files.length) * 50);
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          zip.file(file.name, arrayBuffer);
          setProgress(((i + 1) / files.length) * 50);
        }
      }

      const options: Partial<JSZip.JSZipGeneratorOptions> = {
        type: "blob" as const,
        compression: compressionAlgorithm,
        compressionOptions: { level: compressionLevel },
        encodeFileName: (fileName) => {
          return fileNameEncoding === "UTF-8"
            ? fileName
            : new TextEncoder()
                .encode(fileName)
                .reduce((acc, byte) => acc + String.fromCharCode(byte), "");
        },
      };

      // JSZip does not support password protection natively
      // Removed password option
      // if (password) {
      //   options.password = password;
      // }

      const content = await zip.generateAsync(
        options as JSZip.JSZipGeneratorOptions,
        (metadata) => {
          setProgress(50 + metadata.percent / 2);
        }
      );

      // Ensure content is Blob
      if (!(content instanceof Blob)) {
        throw new Error("压缩内容不是Blob对象");
      }

      if (splitSize > 0 && content.size > splitSize * 1024 * 1024) {
        const parts = Math.ceil(content.size / (splitSize * 1024 * 1024));
        const partSize = Math.ceil(content.size / parts);
        for (let i = 0; i < parts; i++) {
          const start = i * partSize;
          const end = Math.min((i + 1) * partSize, content.size);
          const part = content.slice(start, end);
          const partUrl = URL.createObjectURL(part);
          const a = document.createElement("a");
          a.href = partUrl;
          a.download = `${zipNameRef.current?.value || "compressed"}_part${
            i + 1
          }.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(partUrl);
        }
      } else {
        const url = URL.createObjectURL(content);
        setDownloadUrl(url);
      }
    } catch (err) {
      setError("压缩文件时发生错误");
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
      // JSZip does not support password; removed password option
      const content = await zip.loadAsync(files[0]);
      const extractedFiles: File[] = [];

      let processedFiles = 0;
      const totalFiles = Object.keys(content.files).length;

      for (const [filename, file] of Object.entries(content.files)) {
        if (!file.dir) {
          const blob = await file.async("blob");
          extractedFiles.push(new File([blob], filename));
        }
        processedFiles++;
        setProgress((processedFiles / totalFiles) * 100);
      }

      setFiles(extractedFiles);
    } catch (err) {
      setError("解压文件时发生错误");
      console.error(err);
    } finally {
      setDecompressing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>文件压缩</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <Tabs defaultValue="compress" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabTrigger value="compress">压缩</TabTrigger>
            <TabTrigger value="decompress">解压</TabTrigger>
          </TabsList>
          <TabsContent value="compress">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <motion.div
                {...getRootProps()}
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
                        {/* <Label htmlFor="password">密码</Label>
                        <Input 
                          id="password"
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                        /> */}
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
                {...getRootProps()}
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
