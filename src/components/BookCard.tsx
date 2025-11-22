import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/localStorage";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-smooth">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.image}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary">{book.genre}</Badge>
          <Badge variant="outline">{book.condition}</Badge>
        </div>
        <CardTitle className="line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="line-clamp-2">{book.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="default"
          className="w-full"
          onClick={() => navigate(`/browse?book=${book.id}`)}
        >
          View Book
        </Button>
      </CardFooter>
    </Card>
  );
};
