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

interface DeleteDialogProps {
  isOpen: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  deleteFc: () => void,
}

export function DeleteDialog({ isOpen, setOpen, deleteFc }: DeleteDialogProps) {


  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>温馨提示</AlertDialogTitle>
          <AlertDialogDescription>
            确认当前打开的邮件吗?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={deleteFc}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
