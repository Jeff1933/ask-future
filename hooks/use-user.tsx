import { atom, useAtom } from "jotai"
import { Account, accounts } from "@/data/mock"

type Config = {
  alived: Account["email"] | null
}

const configAtom = atom<Config>({
  alived: accounts[1].email,
})

export function useUser() {
  return useAtom(configAtom)
}

