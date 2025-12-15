"use client"

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  File,
  Inbox,
  MailPlus,
  Search,
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
import { useMail, useTab } from "@/hooks/use-mail";
import { useUser } from "@/hooks/use-user"
import { addDataTest, singleMail  } from "@/lib/idb";
import { format } from "date-fns"
interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  defaultCollapsed?: boolean,
  defaultLayout: number[] | undefined,
  navCollapsedSize: number
}

const navList: NavProps['links'] = [
  {
    title: "邮箱",
    label: "",
    icon: Inbox,
    variant: "default",
  },
  {
    title: "草稿箱",
    label: "9",
    icon: File,
    variant: "ghost",
  },
  {
    title: "新建邮件",
    label: "",
    icon: MailPlus,
    variant: "ghost",
  },
]

export function Mail({
  accounts,
  defaultCollapsed = false,
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [mail] = useMail();
  const [user] = useUser();
  const [tabVal, setTabVal] = useTab();
  const [mails, setMails] = useState<singleMail[]>([]); // 用于存储异步数据
  
  const fetchMails = async () => {
    const data = await addDataTest(); // 异步获取数据
    setMails(data); // 将数据存储到状态中
  };
  useEffect(() => {
    fetchMails(); // 调用异步函数
  }, []); // 空依赖数组，确保只在组件挂载时调用一次

  const nowaday = format(new Date(), "yyyy/MM/dd");
  
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          // localStorage.setItem('react-resizable-panels:layout:mail', JSON.stringify(
          //   sizes
          // ))
          // document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          //   sizes
          // )}`
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
            // localStorage.setItem('react-resizable-panels:collapsed', JSON.stringify(
            //   true
            // ))
            // document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            //   true
            // )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            // localStorage.setItem('react-resizable-panels:collapsed', JSON.stringify(
            //   false
            // ))
            // document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            //   false
            // )}`
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
                return item.title === "邮箱"
              } else {
                return item.title === "新建邮件"
              }
            })}
          >
          </Nav>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* 消息查看 */}
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs 
            value={tabVal}
            onValueChange={(val) => setTabVal(val)}
          >
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">邮箱</h1>
              <TabsList className="ml-auto">
                {user.alived === "future@you.com" ? (
                  <>
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
                  </>
                ) : (
                  <TabsTrigger
                    value="草稿"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    草稿
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            <Separator />
            {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div> */}
            <TabsContent value="可读" className="m-0 mt-4">
              <MailList items={mails.filter((item) => item.arrived <= nowaday && item.send)} />
            </TabsContent>
            <TabsContent value="未抵达" className="m-0 mt-4">
              <MailList items={mails.filter((item) => item.arrived > nowaday && item.send)} />
            </TabsContent>
            <TabsContent value="草稿" className="m-0 mt-4">
              <MailList items={mails.filter((item) => !item.send)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* 消息发送 */}
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
            onRefresh={fetchMails}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}