import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { useTitleModal, useInitEmail } from "@/hooks/use-mail"
import { useRef } from "react"
import { format } from "date-fns"

export function NewDialog() {
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useTitleModal();
  const [initEamil, setInitEmail] = useInitEmail();
  const inputDate = (e: Date | undefined) => {
    setInitEmail({
      ...initEamil,
      arrived: format(e as Date, "yyyy/MM/dd"),
    })
  }
  const onSumbit = () => {
    if (!inputTitleRef.current) return;
    console.log(inputTitleRef.current.value)
    setInitEmail({
      ...initEamil,
      title: inputTitleRef.current.value || "",
    })
    setModalOpen(false);
  }
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>邮件标题</DialogTitle>
          <DialogDescription>
            输入邮件标题与送达时间
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              标题
            </Label>
            <Input id="title" defaultValue={initEamil.title} ref={inputTitleRef} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              送达时间
            </Label>
            <DatePicker date={new Date(initEamil.arrived)} setDate={inputDate} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSumbit}>保存修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
