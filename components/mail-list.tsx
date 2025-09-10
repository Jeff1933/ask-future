
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMail, useReadMode } from "@/hooks/use-mail"
import { useForNow } from "@/hooks/use-user"
import { singleMail } from "@/lib/idb"
import { format } from "date-fns";
import { saveMail } from "@/lib/idb";
interface MailListProps {
  items: singleMail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  const isEdit = useReadMode();
  const [isNow] = useForNow();
  const nowaday = format(new Date(), "yyyy/MM/dd");
  const handleMailClick = async(item: singleMail) => {
    setMail({
      ...mail,
      selected: item.id,
    })
    if (item.send && !item.read) {
      item.read = true;
      await saveMail(item);
    }
  }
  return (
    <ScrollArea className="h-screen">
      <div className="p-4 pt-0 gap-2 flex flex-col">
        {items.map((item) => {
          const ifShow = item.arrived <= nowaday || isNow;
          return (
            <button 
              key={item.id}
              className={cn(
                "flex flex-col bg-transparent hover:bg-accent gap-2 items-start p-3 rounded-lg border border-input text-left transtion-all",
                mail.selected === item.id && "bg-muted",
                ((item.send && !ifShow) || isEdit) && "opacity-50 pointer-events-none"
              )}
              onClick={() => handleMailClick(item)}
              disabled={(item.send && !ifShow) || isEdit}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{ifShow ? item.title : "*****"}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="ml-auto">{ifShow ? item.date : "*******"}</span>
                </div>
              </div>
              <div className="content text-muted-foreground line-clamp-2 text-xs">
                <span className="">{ifShow ? item.plain.substring(0, 200) : "***********"}</span>
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}