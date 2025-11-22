import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getQuiz, setQuizResult, QuizQuestion } from "@/lib/localStorage";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}

export const QuizModal = ({ open, onOpenChange, bookId }: QuizModalProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (open) {
      const quiz = getQuiz(bookId);
      setQuestions(quiz);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setShowResults(false);
      setScore(0);
    }
  }, [open, bookId]);

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      const finalScore = newAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === questions[idx].correctAnswer ? 1 : 0);
      }, 0);
      setScore(finalScore);
      setShowResults(true);

      // Save result
      setQuizResult({
        bookId,
        score: finalScore,
        totalQuestions: questions.length,
        completed: true,
      });

      toast.success(`Quiz completed! Score: ${finalScore}/${questions.length}`);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setShowResults(false);
  };

  if (!questions.length) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Quiz</DialogTitle>
          <DialogDescription>
            Test your knowledge about this book
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {questions[currentQuestion].question}
              </h3>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              >
                {questions[currentQuestion].options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-smooth">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mb-4">
                {score === questions.length ? (
                  <CheckCircle2 className="h-16 w-16 text-accent mx-auto" />
                ) : (
                  <XCircle className="h-16 w-16 text-secondary mx-auto" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Your Score: {score}/{questions.length}
              </h3>
              <p className="text-muted-foreground">
                {score === questions.length
                  ? "Perfect! You know this book well!"
                  : score >= questions.length * 0.7
                  ? "Great job! You have a good understanding."
                  : "Keep reading to learn more!"}
              </p>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    answers[idx] === q.correctAnswer
                      ? "border-accent bg-accent/10"
                      : "border-destructive bg-destructive/10"
                  }`}
                >
                  <p className="font-medium text-sm mb-1">{q.question}</p>
                  <p className="text-xs text-muted-foreground">
                    Your answer: {q.options[answers[idx]]}
                    {answers[idx] !== q.correctAnswer && (
                      <> • Correct: {q.options[q.correctAnswer]}</>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
