import { atom, useAtom } from "jotai"

import { Mail, mails } from "@/data/mock"

type Config = {
  selected: Mail["id"] | null
}

const configAtom = atom<Config>({
  selected: mails[0].id,
})

export function useMail() {
  return useAtom(configAtom)
}

// 创建邮件模式
const createModeAtom = atom<boolean>(false);

export function useMode() {
  return useAtom(createModeAtom)
}
