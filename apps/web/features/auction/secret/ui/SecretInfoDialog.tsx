import { Button } from '@repo/ui/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';

interface SecretInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const SecretInfoDialog = ({ open, onOpenChange }: SecretInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="w-full">
      <DialogHeader className="sr-only">
        <DialogTitle>알림</DialogTitle>
      </DialogHeader>
      <DialogContent showCloseButton={false}>
        <div className="typo-subtitle-small-medium py-[25px] text-center">시크릿경매</div>
        <div className="flex items-center justify-center border-t border-neutral-100">
          <Button
            variant="ghost"
            className="typo-body-medium w-full"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
