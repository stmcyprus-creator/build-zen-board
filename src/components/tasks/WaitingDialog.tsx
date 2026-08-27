import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Task, TaskWaitingInfo, projectContacts } from "@/data/tasksData";

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (info: TaskWaitingInfo) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const WaitingDialog = ({ task, open, onOpenChange, onSubmit }: Props) => {
  const [waitingOn, setWaitingOn] = useState("");
  const [waitingFor, setWaitingFor] = useState("");
  const [waitingSince, setWaitingSince] = useState(today());
  const [remindAt, setRemindAt] = useState("");

  const reset = () => {
    setWaitingOn("");
    setWaitingFor("");
    setWaitingSince(today());
    setRemindAt("");
  };

  const handleSubmit = () => {
    if (!waitingOn.trim() || !waitingFor.trim()) return;
    onSubmit({
      waitingOn: waitingOn.trim(),
      waitingFor: waitingFor.trim(),
      waitingSince: waitingSince || today(),
      remindAt: remindAt || null,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Перевести в «Ожидание»</DialogTitle>
        </DialogHeader>

        {task && <p className="text-sm text-muted-foreground">{task.title}</p>}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="waiting-on">Кого ждём</Label>
            <Input
              id="waiting-on"
              list="project-contacts"
              value={waitingOn}
              onChange={(e) => setWaitingOn(e.target.value)}
              placeholder="Подрядчик, поставщик, заказчик…"
            />
            <datalist id="project-contacts">
              {projectContacts.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="waiting-for">Что именно ждём</Label>
            <Input
              id="waiting-for"
              value={waitingFor}
              onChange={(e) => setWaitingFor(e.target.value)}
              placeholder="например, смету на плитку"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="waiting-since">Ждём с</Label>
              <Input
                id="waiting-since"
                type="date"
                value={waitingSince}
                onChange={(e) => setWaitingSince(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="remind-at">Напомнить когда</Label>
              <Input
                id="remind-at"
                type="date"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!waitingOn.trim() || !waitingFor.trim()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingDialog;
