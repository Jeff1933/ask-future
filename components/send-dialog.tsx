'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { singleMail } from "@/lib/idb";
import { useEffect, useState } from "react";


interface SendDialogProps {
  ifOpen: boolean,
  refObj: React.RefObject<singleMail | null>,
  sendFc: () => void,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export function SendDialog({ ifOpen, refObj, sendFc, setOpen }: SendDialogProps) {
  const [allowSend, setAllowSend] = useState(false);
  const [alertText, setAlertText] = useState<string>("是否确认发送邮件?")
  
  useEffect(() => {
    if (ifOpen) {
      if (refObj.current) {
        if (refObj.current.title === "") {
          setAllowSend(false);
          setAlertText("您的邮件标题未填写, 请点击标题&日程按钮填写并保存");
        } else if (refObj.current.plain === "") {
          setAllowSend(false);
          setAlertText("如果没猜错, 你的邮件空空如也, 先填写邮件内容吧");
        } else {
          setAlertText("是否确认发送邮件?");
          setAllowSend(true);
        }
      }
    }
  }, [ifOpen])

  const handleSend = () => {
    sendFc();
  }

  return (
    <AlertDialog open={ifOpen} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请阅读如下提示</AlertDialogTitle>
          <AlertDialogDescription>
            {alertText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>取消</AlertDialogCancel>
          <AlertDialogAction disabled={!allowSend} onClick={handleSend}>继续发送</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
