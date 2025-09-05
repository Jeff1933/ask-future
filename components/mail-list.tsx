
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMail, useReadMode } from "@/hooks/use-mail"
import { singleMail } from "@/lib/idb"
interface MailListProps {
  items: singleMail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  const isEdit = useReadMode();
  return (
    <ScrollArea className="h-screen">
      <div className="p-4 pt-0 gap-2 flex flex-col">
        {items.map((item) => {
          return (
            <button 
              key={item.id}
              className={cn(
                "flex flex-col bg-transparent hover:bg-accent gap-2 items-start p-3 rounded-lg border border-input text-left transtion-all",
                mail.selected === item.id && "bg-muted",
                isEdit && "opacity-50 pointer-events-none"
              )}
              onClick={() => setMail({
                ...mail,
                selected: item.id,
              })}
              disabled={isEdit}
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
                <span className="">{item.plain.substring(0, 200)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}