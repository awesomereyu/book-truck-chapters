// Utility functions for localStorage management

export interface Book {
  id: string;
  title: string;
  description: string;
  genre: string;
  condition: string;
  image: string;
  featured?: boolean;
  readingTime?: number;
  audioSample?: string;
  transcript?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  bookId: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  hours: number;
  location: string;
  recentActivity: string;
  tasksCompleted: number;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  bookTitle: string;
  condition: string;
  notes: string;
  date: string;
}

// Initialize sample data
export const initializeSampleData = () => {
  if (!localStorage.getItem("books")) {
    const sampleBooks: Book[] = [
      {
        id: "1",
        title: "The Midnight Library",
        description: "A dazzling novel about all the choices that go into a life well lived.",
        genre: "Fiction",
        condition: "New",
        image: "/placeholder.svg",
        featured: true,
        readingTime: 5,
        audioSample: "/audio/sample.mp3",
        transcript: "Between life and death there is a library...",
      },
      {
        id: "2",
        title: "Project Hail Mary",
        description: "A lone astronaut must save the earth from disaster in this stunning novel.",
        genre: "Sci-Fi",
        condition: "Gently Used",
        image: "/placeholder.svg",
        readingTime: 6,
      },
      {
        id: "3",
        title: "The Thursday Murder Club",
        description: "Four unlikely friends meet weekly to investigate unsolved killings.",
        genre: "Mystery",
        condition: "New",
        image: "/placeholder.svg",
        readingTime: 5,
      },
    ];
    localStorage.setItem("books", JSON.stringify(sampleBooks));
  }

  if (!localStorage.getItem("volunteers")) {
    const sampleVolunteers: Volunteer[] = [
      { id: "1", name: "Sarah Chen", hours: 18, location: "Downtown", recentActivity: "2025-11-20", tasksCompleted: 24 },
      { id: "2", name: "Marcus Johnson", hours: 12, location: "Westside", recentActivity: "2025-11-21", tasksCompleted: 16 },
      { id: "3", name: "Elena Rodriguez", hours: 4, location: "Eastside", recentActivity: "2025-11-19", tasksCompleted: 5 },
      { id: "4", name: "David Park", hours: 22, location: "North End", recentActivity: "2025-11-22", tasksCompleted: 31 },
      { id: "5", name: "Aisha Williams", hours: 8, location: "South Bay", recentActivity: "2025-11-18", tasksCompleted: 11 },
      { id: "6", name: "James O'Connor", hours: 15, location: "Downtown", recentActivity: "2025-11-21", tasksCompleted: 19 },
    ];
    localStorage.setItem("volunteers", JSON.stringify(sampleVolunteers));
  }

  if (!localStorage.getItem("quiz-1")) {
    const sampleQuiz: QuizQuestion[] = [
      {
        id: "q1",
        question: "What is the central theme of The Midnight Library?",
        options: ["Time travel", "Parallel lives and choices", "Space exploration", "Detective work"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Who is the protagonist of the story?",
        options: ["Nora Seed", "Mrs. Elm", "Ash", "Izzy"],
        correctAnswer: 0,
      },
      {
        id: "q3",
        question: "What does each book in the library represent?",
        options: ["A genre", "A different life possibility", "A memory", "A lesson"],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "What is Mrs. Elm's role?",
        options: ["Antagonist", "Librarian guide", "Best friend", "Family member"],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "What is the main setting of the story?",
        options: ["A school", "The Midnight Library", "A hospital", "A bookstore"],
        correctAnswer: 1,
      },
    ];
    localStorage.setItem("quiz-1", JSON.stringify(sampleQuiz));
  }
};

// Get/Set functions
export const getBooks = (): Book[] => {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
};

export const getVolunteers = (): Volunteer[] => {
  const volunteers = localStorage.getItem("volunteers");
  return volunteers ? JSON.parse(volunteers) : [];
};

export const setVolunteers = (volunteers: Volunteer[]) => {
  localStorage.setItem("volunteers", JSON.stringify(volunteers));
};

export const getQuiz = (bookId: string): QuizQuestion[] => {
  const quiz = localStorage.getItem(`quiz-${bookId}`);
  return quiz ? JSON.parse(quiz) : [];
};

export const getQuizResult = (bookId: string): QuizResult | null => {
  const result = localStorage.getItem(`quiz-result-${bookId}`);
  return result ? JSON.parse(result) : null;
};

export const setQuizResult = (result: QuizResult) => {
  localStorage.setItem(`quiz-result-${result.bookId}`, JSON.stringify(result));
};

export const getBookCompletion = (bookId: string): boolean => {
  return localStorage.getItem(`book-completed-${bookId}`) === "true";
};

export const setBookCompletion = (bookId: string, completed: boolean) => {
  localStorage.setItem(`book-completed-${bookId}`, completed.toString());
};

export const getCart = (): string[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (bookId: string) => {
  const cart = getCart();
  if (!cart.includes(bookId)) {
    cart.push(bookId);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const getDonations = (): Donation[] => {
  const donations = localStorage.getItem("donations");
  return donations ? JSON.parse(donations) : [];
};

export const addDonation = (donation: Donation) => {
  const donations = getDonations();
  donations.push(donation);
  localStorage.setItem("donations", JSON.stringify(donations));
};

export const getSelectedGenre = (): string => {
  return localStorage.getItem("selectedGenre") || "Fiction";
};

export const setSelectedGenre = (genre: string) => {
  localStorage.setItem("selectedGenre", genre);
};

export const getSelectedCondition = (): string => {
  return localStorage.getItem("selectedCondition") || "New";
};

export const setSelectedCondition = (condition: string) => {
  localStorage.setItem("selectedCondition", condition);
};

export const getPrototypeMode = (): boolean => {
  return localStorage.getItem("prototypeMode") === "true";
};

export const setPrototypeMode = (enabled: boolean) => {
  localStorage.setItem("prototypeMode", enabled.toString());
};

// Authentication (client-side prototype only - NOT SECURE for production)
export interface User {
  id: string;
  name: string;
  role: "volunteer" | "admin";
  password: string; // In real app, this would be hashed on backend
}

export const initializeUsers = () => {
  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      { id: "admin-1", name: "Admin", role: "admin", password: "admin123" },
      { id: "vol-1", name: "Sarah Chen", role: "volunteer", password: "volunteer123" },
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};

export const authenticateUser = (name: string, password: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.name === name && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("currentUser");
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
