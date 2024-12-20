"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Download,
  Edit,
  Share2,
  Clock,
  Tag,
  Archive,
  Lock,
  Trash2,
  FileIcon,
} from "lucide-react";
import { File } from "@/types/filesystem";

interface ContextMenuProps {
  x: number;
  y: number;
  file: File;
  handleFileOperation: (operation: string, file: File) => void;
  closeContextMenu: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  file,
  handleFileOperation,
  closeContextMenu,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
      }}
      className="bg-gray-800 rounded-lg shadow-lg"
    >
      <ul className="py-2">
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("preview", file);
            closeContextMenu();
          }}
        >
          <Eye className="w-4 h-4 inline-block mr-2" />
          Preview
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("download", file);
            closeContextMenu();
          }}
        >
          <Download className="w-4 h-4 inline-block mr-2" />
          Download
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("rename", file);
            closeContextMenu();
          }}
        >
          <Edit className="w-4 h-4 inline-block mr-2" />
          Rename
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("share", file);
            closeContextMenu();
          }}
        >
          <Share2 className="w-4 h-4 inline-block mr-2" />
          Share
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("versionHistory", file);
            closeContextMenu();
          }}
        >
          <Clock className="w-4 h-4 inline-block mr-2" />
          Version History
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("manageTags", file);
            closeContextMenu();
          }}
        >
          <Tag className="w-4 h-4 inline-block mr-2" />
          Manage Tags
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("compress", file);
            closeContextMenu();
          }}
        >
          <Archive className="w-4 h-4 inline-block mr-2" />
          Compress/Decompress
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("encrypt", file);
            closeContextMenu();
          }}
        >
          <Lock className="w-4 h-4 inline-block mr-2" />
          Encrypt/Decrypt
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-500"
          onClick={() => {
            handleFileOperation("delete", file);
            closeContextMenu();
          }}
        >
          <Trash2 className="w-4 h-4 inline-block mr-2" />
          Delete
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            handleFileOperation("properties", file);
            closeContextMenu();
          }}
        >
          <FileIcon className="w-4 h-4 inline-block mr-2" />
          Properties
        </li>
      </ul>
    </motion.div>
  );
};
