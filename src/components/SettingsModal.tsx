import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { getPrototypeMode, setPrototypeMode } from "@/lib/localStorage";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [prototypeMode, setPrototypeModeState] = useState(getPrototypeMode());

  const handleTogglePrototypeMode = (checked: boolean) => {
    setPrototypeModeState(checked);
    setPrototypeMode(checked);
    toast.success(`Prototype mode ${checked ? "enabled" : "disabled"}`);
  };

  const handleSharePrototype = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    toast.success("Demo link copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your prototype settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="prototype-mode">Prototype Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable demo simulation features
              </p>
            </div>
            <Switch
              id="prototype-mode"
              checked={prototypeMode}
              onCheckedChange={handleTogglePrototypeMode}
            />
          </div>

          <div className="space-y-2">
            <Label>Share Prototype</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSharePrototype}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copy Demo Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
