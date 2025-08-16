"use client"

import { type Mail } from "@/data/mock";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  File,
  Inbox,
  Send,
  Search,
  Trash2,
} from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/components/account-switcher";
import { MailList } from "@/components/mail-list";
import { MailDisplay } from "@/components/mail-display";
import { Nav, NavProps } from "@/components/nav";
import { useMail } from "@/hooks/use-mail";
import { useUser } from "@/hooks/use-user"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[],
  defaultCollapsed?: boolean,
  defaultLayout: number[] | undefined,
  navCollapsedSize: number
}

const navList: NavProps['links'] = [
  {
    title: "邮箱",
    label: "128",
    icon: Inbox,
    variant: "default",
  },
  {
    title: "垃圾箱",
    label: "9",
    icon: Trash2,
    variant: "ghost",
  },
  {
    title: "发送",
    label: "",
    icon: Send,
    variant: "ghost",
  },
]

export function Mail({
  accounts,
  mails,
  defaultCollapsed = false,
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [mail] = useMail();
  const [user] = useUser();
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[50rem] items-stretch "
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
              "min-w-[3.125rem] transition-all duration-300 ease-in-out"
          )}
        >
          <div 
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher
              isCollapsed={isCollapsed}
              accounts={accounts}
            />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={navList.filter(item => {
              if (user.alived === "future@you.com") {
                return item.title !== "发送"
              } else {
                return item.title !== "邮箱"
              }
            })}
          >
          </Nav>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* 消息查看 */}
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="可读">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">邮箱</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="可读"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  可读
                </TabsTrigger>
                <TabsTrigger
                  value="未抵达"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  未抵达
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="可读" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="未抵达" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* 消息发送 */}
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}