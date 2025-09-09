"use client"
import dynamic from "next/dynamic"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Trash2,
  File,
  Send,
  CalendarFold,
  LogOut,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewDialog } from "./new-dialog"
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { singleMail, deleteMail, saveMail } from "@/lib/idb";
import { useWriteMail, useMode, useTitleModal, useInitEmail, useShowEditBt } from "@/hooks/use-mail";
import { useForNow } from "@/hooks/use-user";
import { format } from "date-fns";
import { useAutoSave } from "@/hooks/use-auto-save";
import { SendDialog } from "./send-dialog";
import { DeleteDialog } from "./delete-dialog";
// 动态导入 wangEdit.tsx
const MyEditor = dynamic(() => import("@/components/wangEdit"), { ssr: false });

interface MailDisplayProps {
  mail: singleMail | null,
  onRefresh: () => Promise<void>;
}


const buttons = [
  {
    title: "删除邮件",
    variant: "ghost" as "ghost" | "default",
    icon: Trash2,
  },
  {
    title: "保存",
    variant: "ghost"  as "ghost" | "default",
    icon: File,
  },
  {
    title: "发送",
    variant: "ghost" as "ghost" | "default",
    icon: Send,
  },
  {
    title: "标题&日程",
    variant: "ghost" as "ghost" | "default",
    icon: CalendarFold,
  },
  {
    title: "退出编辑",
    variant: "ghost" as "ghost" | "default",
    icon: LogOut,
  },
];

export function MailDisplay({ mail, onRefresh }: MailDisplayProps) {
  const editorRef = useRef<{ save: (mail: MailDisplayProps["mail"], isSend?: boolean) => void }>(null);
  const [createMode, setCreateMode] = useMode();
  const setMail = useWriteMail();
  const [modalOpen, setModalOpen] = useTitleModal();
  const [initEmail, setInitEmail] = useInitEmail();
  const [showEditBt, setShowEditBt] = useShowEditBt();
  const [isNow, setIsNow] = useForNow();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const mailRef = useRef(mail);
  const [replyTextValue, setReplyTextValue] = useState("");
  useEffect(() => {
    if (mail === null) {
      console.log("初始化")
      mailRef.current = {
        id: new Date().toISOString(),
        title: "",
        plain: "",
        text: "",
        date: "",
        read: false,
        reply: "",
        arrived: "",
        send: false,
        img: null,
      };
    } else {
      console.log("选中邮件")
      setShowEditBt(true);
      if (mailRef.current !== null) {
        if (mailRef.current.date === "") {
          setCreateMode(false);
        }
      }
      mailRef.current = mail;
    }
  }, [mail, setCreateMode, setShowEditBt]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, link: typeof buttons[number]) => {
    e.preventDefault();
    if (link.title === "保存") {
      if (editorRef.current) {
        if (mailRef.current?.title === "") {
          mailRef.current.title = initEmail.title;
          mailRef.current.arrived = initEmail.arrived;
        }
        editorRef.current.save(mailRef.current);
        outEditing();
        onRefresh();
      }
    } else if (link.title === "发送") {
      if (mailRef.current?.title === "" && initEmail.title !== "") {
        mailRef.current.title = initEmail.title;
        mailRef.current.arrived = initEmail.arrived;
      }
      setSendModalOpen(true);
    } else if (link.title === "标题&日程") {
      setModalOpen(true);
    } else if (link.title === "退出编辑") {
      if (createMode) {
        deleteFc(mailRef.current);
      } else {
        outEditing();
      }
    } else if (link.title === "删除邮件") {
      console.log("删除")
      setDeleteModalOpen(true);
    }
  }
  // 发送邮件
  const sendFc = () => {
    if (editorRef.current) {
      editorRef.current.save(mailRef.current, true);
      outEditing();
      onRefresh();
    }
  }
  // 删除邮件
  const deleteFc = async (target = mail ? mail : mailRef.current) => {
    if (target !== null) {
      try {
        await deleteMail(target);
        outEditing();
        onRefresh();
      } catch(e) {
        console.error(e);
      }
    }
  }
  // 退出编辑状态
  const outEditing = () => {
    setCreateMode(false);
    setShowEditBt(false);
    // 取消选中
    setMail({
      selected: null,
    });
    setInitEmail({
      ...initEmail,
      title: "",
      arrived: format(new Date(), "yyyy/MM/dd"),
    })
  }
  // 回复邮件
  const replyMail = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 阻止表单提交
    if (mail !== null) {
      if (replyTextValue !== "") {
        console.log(replyTextValue);
        mail.reply = replyTextValue
        try {
          await saveMail(mail);
          setReplyTextValue("");
          // 取消选中
          setMail({
            selected: null,
          });
          onRefresh();
        } catch(e) {
          console.error(e);
        }
      }
    }
  }
  // 保存邮件
  const saveE = () => {
    if (createMode) {
      if (editorRef.current) {
        editorRef.current.save(mailRef.current);
      }
    }
  }

  useAutoSave(saveE);

  const content = useMemo(() => {
    return {
      text: mail?.text || '',
      img: mail?.img || null,
    }
  }, [mail])

  return (
    <>
      <div className="flex h-full flex-col">
        <div className={`flex items-center px-4 py-2`}>
          {showEditBt && isNow && buttons.map((link, index) => {
            return (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button                    
                    onClick={(e) => handleClick(e, link)}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                    disabled={link.title === "删除邮件" && mail === null}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex items-center gap-4">
                  {link.title}                  
                </TooltipContent>
              </Tooltip>
            )
          })}
          <div className="flex ml-auto h-9 items-center cursor-pointer">
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <Separator />
        {createMode || (showEditBt && isNow) ? (
          <div className="p-4 flex-1">
              <MyEditor ref={editorRef} eHeight={'82vh'} content={content} />
          </div>
        ) : mail ? (
          <div className="flex flex-col flex-1">
            <div className="p-4 items-start flex">
              <div className="flex items-start gap-4 text-sm">
                <span className="relative h-10 w-10 shrink-0 rounded-full flex overflow-hidden">
                  <span className="flex justify-center items-center bg-muted rounded-full h-full w-full">
                    你
                  </span>
                </span>
                <div className="font-semibold">{mail.title}</div>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">{mail.date}</div>
            </div>
            <Separator />
            <div className="p-4 flex-1">
              <MyEditor ref={editorRef} content={content} />
            </div>
            {/* <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <div>{mail.text}</div>
            </div> */}
            <Separator className="mt-auto" />
            <div className="p-4">
              <form>
                {mail.reply !== "" ?
                  <div className="">
                    <Textarea
                      className="p-4"
                      value={mail.reply}
                      readOnly
                    />
                  </div> :
                  <div className="grid gap-4">
                    <Textarea
                      className="p-4 max-h-[30vh]"
                      placeholder={`Reply to You...`}
                      value={replyTextValue}
                      onChange={(e) => setReplyTextValue(e.target.value)}
                    />
                    <div className="flex items-center">
                      <Button
                        onClick={(e) => replyMail(e)}
                        size="sm"
                        className="ml-auto bg-primary text-primary-foreground"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                }
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No message selected
          </div>
        )}
      </div>
      <NewDialog />
      <SendDialog ifOpen={sendModalOpen} refObj={mailRef} sendFc={sendFc} setOpen={setSendModalOpen} />
      <DeleteDialog isOpen={deleteModalOpen} setOpen={setDeleteModalOpen} deleteFc={deleteFc} />
    </>
  )
}