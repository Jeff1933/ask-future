import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// twMerge：处理 Tailwind CSS 类名冲突的工具，如：p-4 和 p-2 是冲突的类名，twMerge 会保留优先级更高的类名
// 根据输入动态生成一个字符串形式的 CSS 类名。过滤掉无效的值
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
