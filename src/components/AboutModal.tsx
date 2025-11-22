import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutModal = ({ open, onOpenChange }: AboutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>About The Truck</DialogTitle>
          <DialogDescription>Learn more about our mobile book truck initiative</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-foreground">
          <p>
            <strong>The Second Chapter</strong> is a mobile book truck bringing affordable, quality books
            to communities across the city. We believe everyone deserves access to great literature,
            regardless of location or income.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">Our Mission</h4>
            <p>
              To promote literacy, learning, and the joy of reading by making books accessible to all.
              We collect gently used and new books through donations and sell them at affordable prices.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">How It Works</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Community members donate books they've finished reading</li>
              <li>Volunteers sort, categorize, and price the books</li>
              <li>Our mobile truck visits neighborhoods on a rotating schedule</li>
              <li>Books are sold at affordable prices or given away at community events</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">Get Involved</h4>
            <p className="text-muted-foreground">
              Volunteer with us, donate your books, or follow our truck schedule to find us in your neighborhood!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
