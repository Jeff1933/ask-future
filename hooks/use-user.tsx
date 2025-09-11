import { atom, useAtom } from "jotai"
import { Account, accounts } from "@/data/mock"

type Config = {
  alived: Account["email"] | null
}

const userAtom = atom<Config>({
  alived: accounts[1].email,
})

export function useUser() {
  return useAtom(userAtom)
}

const onlyInNow = atom((get) => {
  const user = get(userAtom);
  const isNow = user.alived === "now@you.com";
  return isNow;
})

export function useForNow() {
  return useAtom(onlyInNow);
}

