import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizModal } from "@/components/QuizModal";
import { ChevronLeft, ChevronRight, ShoppingCart, Download, CheckCircle, Volume2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getBooks,
  addToCart,
  setBookCompletion,
  getBookCompletion,
  getQuizResult,
  Book,
  getPrototypeMode,
  setQuizResult,
  getVolunteers,
  setVolunteers,
} from "@/lib/localStorage";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const BrowseBooks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("book") || "1";
  const isDemo = searchParams.get("demo") === "true";
  
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    const allBooks = getBooks();
    setBooks(allBooks);
    const book = allBooks.find((b) => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      const index = allBooks.indexOf(book);
      setCurrentIndex(index);
      setIsCompleted(getBookCompletion(bookId));
      
      const result = getQuizResult(bookId);
      if (result) {
        setQuizScore({ score: result.score, total: result.totalQuestions });
      }
    }
  }, [bookId]);

  useEffect(() => {
    if (isDemo) {
      runDemoFlow();
    }
  }, [isDemo]);

  const runDemoFlow = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto-open quiz
    toast.info("Taking quiz...");
    setQuizOpen(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Auto-complete quiz with perfect score
    const perfectScore = { bookId: "1", score: 5, totalQuestions: 5, completed: true };
    setQuizResult(perfectScore);
    setQuizScore({ score: 5, total: 5 });
    setQuizOpen(false);
    
    toast.success("Quiz completed with perfect score!");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto-complete reading
    handleCompleteReading();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add demo volunteer
    const volunteers = getVolunteers();
    const demoVolunteer = {
      id: "demo-" + Date.now(),
      name: "Demo User",
      hours: 25,
      location: "Virtual",
      recentActivity: new Date().toISOString().split('T')[0],
      tasksCompleted: 35,
    };
    setVolunteers([...volunteers, demoVolunteer]);
    
    toast.success("Demo volunteer added to dashboard!");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newBook = books[currentIndex - 1];
      navigate(`/browse?book=${newBook.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < books.length - 1) {
      const newBook = books[currentIndex + 1];
      navigate(`/browse?book=${newBook.id}`);
    }
  };

  const handleAddToCart = () => {
    if (currentBook) {
      addToCart(currentBook.id);
      toast.success(`${currentBook.title} added to cart!`);
    }
  };

  const handleCompleteReading = () => {
    if (currentBook) {
      setBookCompletion(currentBook.id, true);
      setIsCompleted(true);
      toast.success("Book marked as complete! Progress updated.");
    }
  };

  const handleDownloadBookInfo = () => {
    if (currentBook) {
      const bookInfo = {
        title: currentBook.title,
        description: currentBook.description,
        genre: currentBook.genre,
        condition: currentBook.condition,
        readingTime: currentBook.readingTime,
      };
      const dataStr = JSON.stringify(bookInfo, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", `${currentBook.title.replace(/\s+/g, "-")}.json`);
      linkElement.click();
      toast.success("Book info downloaded!");
    }
  };

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Book not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-border py-3 px-4 bg-card">
        <div className="container max-w-6xl mx-auto">
          <nav className="text-sm text-muted-foreground">
            <button onClick={() => navigate("/")} className="hover:text-primary transition-smooth">
              Home
            </button>
            <span className="mx-2">&gt;</span>
            <span className="text-foreground">Browse Books</span>
          </nav>
        </div>
      </div>

      {/* Featured Book Section */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-elevated">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{currentBook.title}</CardTitle>
                  <CardDescription className="text-base">
                    A captivating journey through {currentBook.genre.toLowerCase()} literature
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{currentBook.genre}</Badge>
                  <Badge variant="outline">{currentBook.condition}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Book Image */}
                <div className="w-full lg:w-80 aspect-[3/4] overflow-hidden rounded-lg bg-muted flex-shrink-0">
                  <img
                    src={currentBook.image}
                    alt={`Cover of ${currentBook.title}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">About This Book</h3>
                    <p className="text-muted-foreground leading-relaxed">{currentBook.description}</p>
                    {currentBook.readingTime && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Estimated reading time: ~{currentBook.readingTime} minutes
                      </p>
                    )}
                  </div>

                  {/* Audio Sample & Transcript */}
                  {currentBook.audioSample && (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Audio Sample
                      </Button>

                      {currentBook.transcript && (
                        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="text-sm">
                              {transcriptOpen ? "Hide" : "Show"} Transcript
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground italic">
                              "{currentBook.transcript}"
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  )}

                  {/* Progress Widget */}
                  {(isCompleted || quizScore) && (
                    <Card className="bg-accent/10 border-accent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {isCompleted && (
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                        {quizScore && (
                          <div className="text-sm text-foreground">
                            Quiz Score: {quizScore.score}/{quizScore.total}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleAddToCart} size="lg" variant="hero">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button onClick={() => setQuizOpen(true)} size="lg" variant="secondary">
                      Take a Quiz About This Book
                    </Button>
                    {!isCompleted && (
                      <Button onClick={handleCompleteReading} size="lg" variant="outline">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Complete Reading
                      </Button>
                    )}
                    <Button onClick={handleDownloadBookInfo} size="lg" variant="ghost">
                      <Download className="mr-2 h-5 w-5" />
                      Download Book Info
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Book
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === books.length - 1}
            >
              Next Book
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <QuizModal open={quizOpen} onOpenChange={setQuizOpen} bookId={currentBook.id} />
    </div>
  );
};

export default BrowseBooks;
