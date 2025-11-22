import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { AboutModal } from "@/components/AboutModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Info, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  initializeSampleData,
  getBooks,
  getSelectedGenre,
  setSelectedGenre,
  getSelectedCondition,
  setSelectedCondition,
  Book,
  getBookCompletion,
  getPrototypeMode,
  setPrototypeMode,
  setQuizResult,
  setBookCompletion,
  getVolunteers,
  setVolunteers,
} from "@/lib/localStorage";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [genre, setGenre] = useState(getSelectedGenre());
  const [condition, setCondition] = useState(getSelectedCondition());
  const [completionProgress, setCompletionProgress] = useState(0);

  useEffect(() => {
    initializeSampleData();
    setBooks(getBooks());
    calculateProgress();
  }, []);

  const calculateProgress = () => {
    const allBooks = getBooks();
    const completedCount = allBooks.filter(book => getBookCompletion(book.id)).length;
    const progress = allBooks.length > 0 ? (completedCount / allBooks.length) * 100 : 0;
    setCompletionProgress(progress);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    setSelectedGenre(value);
  };

  const handleConditionChange = (value: string) => {
    setCondition(value);
    setSelectedCondition(value);
  };

  const filteredBooks = books.filter(
    (book) => book.genre === genre && book.condition === condition
  );

  const featuredBook = books.find((book) => book.featured);

  const handleDownloadBooklist = () => {
    const booklist = books.map(book => ({
      title: book.title,
      genre: book.genre,
      condition: book.condition,
    }));
    const dataStr = JSON.stringify(booklist, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = "booklist.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Booklist downloaded for offline use!");
  };

  const handleRunDemo = async () => {
    toast.info("Starting demo simulation...");
    
    // Enable prototype mode
    setPrototypeMode(true);
    
    // Auto-select genres
    handleGenreChange("Fiction");
    handleConditionChange("New");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to browse page
    navigate("/browse?book=1&demo=true");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-16 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Great Read
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Browse affordable books from our mobile library truck
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/browse")}
              className="text-base"
            >
              Start Browsing
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRunDemo}
              className="text-base border-white text-white hover:bg-white/20"
            >
              <Play className="mr-2 h-5 w-5" />
              Run Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Select Genre
              </label>
              <Select value={genre} onValueChange={handleGenreChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="YA">Young Adult</SelectItem>
                  <SelectItem value="Nonfiction">Nonfiction</SelectItem>
                  <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                  <SelectItem value="Classics">Classics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Book Condition
              </label>
              <Select value={condition} onValueChange={handleConditionChange}>
                <SelectTrigger>
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
        </div>
      </section>

      {/* Progress Section */}
      {completionProgress > 0 && (
        <section className="py-6 px-4 bg-warm">
          <div className="container max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">
                  Reading Progress: {Math.round(completionProgress)}%
                </p>
                <Progress value={completionProgress} className="h-2" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Book of the Day */}
      {featuredBook && (
        <section className="py-12 px-4">
          <div className="container max-w-6xl mx-auto">
            <Card className="border-2 border-primary shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Book of the Day</CardTitle>
                <CardDescription>Handpicked recommendation from our collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 aspect-[3/4] overflow-hidden rounded-lg bg-muted flex-shrink-0">
                    <img
                      src={featuredBook.image}
                      alt={`Cover of ${featuredBook.title}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{featuredBook.title}</h3>
                    <p className="text-muted-foreground mb-4">{featuredBook.description}</p>
                    <Button onClick={() => navigate(`/browse?book=${featuredBook.id}`)}>
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Books Grid */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {genre} Books ({condition})
          </h2>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No books found for this combination. Try different filters!
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="outline" onClick={handleDownloadBooklist}>
            <Download className="mr-2 h-4 w-4" />
            Download Booklist (Offline Mode)
          </Button>
          <Button variant="ghost" onClick={() => setAboutOpen(true)}>
            <Info className="mr-2 h-4 w-4" />
            About the Truck
          </Button>
        </div>
      </footer>

      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
};

export default Index;
