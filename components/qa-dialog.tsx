import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "./ui/separator"

interface QADialogProps {
  isOpen: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const qaList = [
  {
    q: "如何使用?",
    a: "在新建邮件时，角色切换、邮件选择等功能会禁用，您只能通过右上方的功能按钮操作"
  },
  {
    q: "标题怎么加?",
    a: "点击“标题&日程”按钮之后在弹窗内进行编辑，编辑之后点击保存修改，注意最后要点击“保存”按钮才能保存到邮件里面"
  },
]

export function QADialog({ isOpen, setOpen }: QADialogProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] 2xl:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Q&A</DialogTitle>
          <DialogDescription>
            一些常见问题
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col py-4">
          {qaList.map((qa, index) => {
            return (
              <div key={index} className="flex flex-col gap-1 mb-4 last:mb-0">
                <div className="text-" >{index + 1 + '. '} {qa.q}</div>
                <Separator />
                <div className="text-[14px] 2xl:text-[1rem] text-muted-foreground">{qa.a}</div>
              </div>
            )
          })}
        </div>
        <DialogFooter>
          {/* <Button type="submit" onClick={onSumbit}>保存修改</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
