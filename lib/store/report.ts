import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Issue = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature";
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
  tags: string[];
};

type Comment = {
  id: number;
  issueId: number;
  content: string;
  author: string;
  createdAt: string;
};

interface IssueStore {
  issues: Issue[];
  comments: Comment[];
  addIssue: (issue: Omit<Issue, "id">) => void;
  updateIssue: (issue: Issue) => void;
  deleteIssue: (id: number) => void;
  addComment: (comment: Omit<Comment, "id" | "createdAt">) => void;
}

const mockIssues: Issue[] = [
  {
    id: 1,
    title: "登录页面无响应",
    description: "点击登录按钮后页面卡住",
    type: "bug",
    status: "open",
    priority: "high",
    tags: ["前端", "认证"],
  },
  {
    id: 2,
    title: "添加黑暗模式",
    description: "希望能够添加黑暗模式以改善夜间使用体验",
    type: "feature",
    status: "in-progress",
    priority: "medium",
    tags: ["UI", "用户体验"],
  },
  {
    id: 3,
    title: "性能优化",
    description: "大数据加载时页面响应缓慢",
    type: "bug",
    status: "closed",
    priority: "low",
    tags: ["性能", "后端"],
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    issueId: 1,
    content: "我也遇到了这个问题，希望能尽快修复。",
    author: "用户A",
    createdAt: "2023-06-01T10:00:00Z",
  },
  {
    id: 2,
    issueId: 2,
    content: "非常期待这个功能！",
    author: "用户B",
    createdAt: "2023-06-02T14:30:00Z",
  },
];

const useRealStore = create<IssueStore>()(
  persist(
    (set) => ({
      issues: [],
      comments: [],
      addIssue: (issue) =>
        set((state) => ({
          issues: [{ ...issue, id: Date.now() }, ...state.issues],
        })),
      updateIssue: (updatedIssue) =>
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === updatedIssue.id ? updatedIssue : issue
          ),
        })),
      deleteIssue: (id) =>
        set((state) => ({
          issues: state.issues.filter((issue) => issue.id !== id),
        })),
      addComment: (comment) =>
        set((state) => ({
          comments: [
            ...state.comments,
            { ...comment, id: Date.now(), createdAt: new Date().toISOString() },
          ],
        })),
    }),
    {
      name: "issue-storage",
    }
  )
);

const useMockStore = create<IssueStore>()((set) => ({
  issues: mockIssues,
  comments: mockComments,
  addIssue: (issue) =>
    set((state) => ({
      issues: [{ ...issue, id: Date.now() }, ...state.issues],
    })),
  updateIssue: (updatedIssue) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue
      ),
    })),
  deleteIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== id),
    })),
  addComment: (comment) =>
    set((state) => ({
      comments: [
        ...state.comments,
        { ...comment, id: Date.now(), createdAt: new Date().toISOString() },
      ],
    })),
}));

export const useIssueStore = () => {
  const isMockMode =
    typeof window !== "undefined" &&
    localStorage.getItem("mockMode") === "true";
  return isMockMode ? useMockStore() : useRealStore();
};
