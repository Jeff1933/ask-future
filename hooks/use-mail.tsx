import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { format } from "date-fns"
import { Mail, mails } from "@/data/mock"

// 选中的邮件
type Config = {
  selected: Mail["id"] | null
}

export const emailSelectedAtom = atom<Config>({
  selected: mails[0].id,
})

export function useMail() {
  return useAtom(emailSelectedAtom);
}

export function useWriteMail() {
  return useSetAtom(emailSelectedAtom);
}

export function useReadMail() {
  return useAtomValue(emailSelectedAtom);
}

// 创建邮件模式
const createModeAtom = atom<boolean>(false);

export function useMode() {
  return useAtom(createModeAtom)
}

export function useReadMode() {
  return useAtomValue(createModeAtom);
}

export function useWriteMode() {
  return useSetAtom(createModeAtom);
}

// 选中的邮件类别
const tabAtom = atom<string>("可读");

export function useTab() {
  return useAtom(tabAtom);
}

// 创建邮件时初始化数据
interface initEmail {
  title: string,
  arrived: string,
}

const initEmailAtom = atom<initEmail>({
  title: '',
  arrived: format(new Date(), "yyyy/MM/dd"),
})

export function useInitEmail() {
  return useAtom(initEmailAtom);
}

const titleModalAtom = atom<boolean>(false);

export function useTitleModal() {
  return useAtom(titleModalAtom);
}

// 显示邮件操作按钮
const showEditBtAtom = atom<boolean>(false);

export function useShowEditBt() {
  return useAtom(showEditBtAtom);
}