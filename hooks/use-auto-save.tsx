import { useEffect, useRef } from "react";
import { atom, useAtom, useSetAtom } from "jotai"
import { useForNow } from "./use-user";
const changeFlag = atom<number>(0);

export function useChangeFlag() {
  return useAtom(changeFlag);
}

export function useWriteChangeFlag() {
  return useSetAtom(changeFlag);
}

export function useAutoSave(fn: () => void, delay: number = 3000) {
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const [flag] = useAtom(changeFlag);
  const [isNow] = useForNow();

  useEffect(() => {
    if (isNow) {
      // console.log("let's go")
      if (!timeId.current) {
        timeId.current = setTimeout(() => {
          timeId.current = null;
          fn();
        }, delay);
      }
    }
  }, [flag])
}