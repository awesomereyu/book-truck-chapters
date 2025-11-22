import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDonation } from "@/lib/localStorage";
import { toast } from "sonner";
import { Printer, CheckCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DonationForm = () => {
  const [formData, setFormData] = useState({
    donorName: "",
    email: "",
    bookTitle: "",
    condition: "Gently Used",
    notes: "",
  });
  const [scriptOpen, setScriptOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.email || !formData.bookTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    const donation = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
    };

    addDonation(donation);
    toast.success("Donation recorded successfully!");

    setFormData({
      donorName: "",
      email: "",
      bookTitle: "",
      condition: "Gently Used",
      notes: "",
    });
  };

  const handlePrintReceipt = () => {
    if (!formData.donorName || !formData.bookTitle) {
      toast.error("Please fill in donor name and book title first");
      return;
    }

    // Simple receipt generation (in a real app, this would generate a PDF)
    const receiptContent = `
      DONATION RECEIPT
      The Second Chapter - Mobile Book Truck
      
      Donor: ${formData.donorName}
      Email: ${formData.email}
      Book: ${formData.bookTitle}
      Condition: ${formData.condition}
      Date: ${new Date().toLocaleDateString()}
      
      Thank you for your generous donation!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Donation Form</h1>
          <p className="text-muted-foreground">Help us grow our collection by donating your books</p>
        </div>

        <div className="grid gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book Donation Intake</CardTitle>
              <CardDescription>Fill in the details of your book donation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donorName">
                      Donor Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="donorName"
                      value={formData.donorName}
                      onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookTitle">
                      Book Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bookTitle"
                      value={formData.bookTitle}
                      onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                      placeholder="The name of the book"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Book Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Gently Used">Gently Used</SelectItem>
                        <SelectItem value="Well-Loved">Well-Loved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information about the book..."
                    rows={4}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Donation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrintReceipt}
                    className="flex-1"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Volunteer Activity Script */}
          <Collapsible open={scriptOpen} onOpenChange={setScriptOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>30-Minute Book Truck Volunteer Activity</CardTitle>
                      <CardDescription>Step-by-step guide for volunteer sessions</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      {scriptOpen ? "Hide" : "Show"} Script
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Objective</h4>
                    <p className="text-sm text-muted-foreground">
                      Process donated books, organize inventory, and engage with community members
                      to promote literacy and book accessibility.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">Materials Needed</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Donated books collection</li>
                      <li>Sorting bins (by genre and condition)</li>
                      <li>Price labels and markers</li>
                      <li>Inventory log sheets</li>
                      <li>Cleaning supplies (wipes, dusters)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">Activity Steps</h4>
                    <ol className="space-y-3 text-sm text-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <div>
                          <strong>Warm-Up (5 min):</strong> Welcome volunteers, review objectives,
                          and assign roles (sorting, cleaning, labeling, community engagement).
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <div>
                          <strong>Initial Sorting (5 min):</strong> Sort donated books by condition
                          (New, Gently Used, Well-Loved) and remove any damaged books.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <div>
                          <strong>Genre Categorization (5 min):</strong> Further sort books by genre
                          (Fiction, Mystery, YA, Nonfiction, Sci-Fi, Classics).
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">4.</span>
                        <div>
                          <strong>Cleaning & Prep (5 min):</strong> Wipe down book covers and check
                          for missing pages or excessive wear.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">5.</span>
                        <div>
                          <strong>Pricing & Labeling (3 min):</strong> Apply price labels based on
                          condition and record in inventory log.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">6.</span>
                        <div>
                          <strong>Shelving (3 min):</strong> Organize books on truck shelves by
                          genre, ensuring easy browsing for customers.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">7.</span>
                        <div>
                          <strong>Community Engagement (2 min):</strong> Prepare promotional materials
                          or discussion points for upcoming truck stops.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">8.</span>
                        <div>
                          <strong>Wrap-Up (2 min):</strong> Review accomplishments, log hours worked,
                          and plan next session's focus.
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
