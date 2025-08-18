"use client"
import dynamic from "next/dynamic"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Trash2,
  File,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef } from "react"
// 动态导入 wangEdit.tsx
const MyEditor = dynamic(() => import("@/components/wangEdit"), { ssr: false });

interface MailDisplayProps {
  mail: {
    id: string,
    title: string,
    plain: string,
    text: string,
    date: string,
    read: boolean,
    reply: string,
    arrived: boolean,
    img: Blob[] | null,
  } | null
}


const buttons = [
  {
    title: "移到垃圾箱",
    variant: "ghost" as "ghost" | "default",
    icon: Trash2,
  },
  {
    title: "保存",
    variant: "ghost"  as "ghost" | "default",
    icon: File,
  }
];

export function MailDisplay({ mail }: MailDisplayProps) {
  const editorRef = useRef<{ save: (mail: MailDisplayProps["mail"]) => void }>(null);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof buttons[number]) => {
    e.preventDefault();
    if (link.title === "保存") {
      if (editorRef.current) {
        editorRef.current.save(mail);
      }
    }
  }
  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center px-4 py-2">
          {buttons.map((link, index) => {
            return (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    onClick={(e) => handleClick(e, link)}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex items-center gap-4">
                  {link.title}                  
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <Separator />
        {mail ? (
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
              <MyEditor ref={editorRef} content={{ text: mail.text, img: mail.img }} />
            </div>            
            {/* <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <div>{mail.text}</div>
            </div> */}
            <Separator className="mt-auto" />
            <div className="p-4">
              <form>
                <div className="grid gap-4">
                  <Textarea
                    className="p-4 max-h-[30vh]"
                    placeholder={`Reply to You...`}
                  />
                  <div className="flex items-center">
                    <Button
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                      className="ml-auto"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No message selected
          </div>
        )}
      </div>
    </>
  )
}