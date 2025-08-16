
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMail } from "@/hooks/use-mail"
interface MailListProps {
  items: {
    id: string,
    title: string,
    text: string,
    date: string,
    read: boolean,
    reply: string,
    arrived: boolean,
  }[],
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  return (
    <ScrollArea className="h-screen">
      <div className="p-4 pt-0 gap-2 flex flex-col">
        {items.map((item) => {
          return (
            <button 
              key={item.id}
              className={cn(
                "flex flex-col bg-muted hover:bg-accent gap-2 items-start p-3 rounded-lg border border-input text-left transtion-all",
                mail.selected === item.id && "bg-muted"
              )}
              onClick={() => setMail({
                ...mail,
                selected: item.id,
              })}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.title}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="ml-auto">{item.date}</span>
                </div>
              </div>
              <div className="content text-muted-foreground line-clamp-2 text-xs">
                <span className="">{item.text.substring(0, 200)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}