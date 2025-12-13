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

// Schedule Management
export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  location: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isClosed: boolean;
}

// Check if a date is a US federal holiday
const isFederalHoliday = (date: Date): { isHoliday: boolean; name: string } => {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const year = date.getFullYear();

  // Fixed holidays
  if (month === 0 && day === 1) return { isHoliday: true, name: "New Year's Day" };
  if (month === 5 && day === 19) return { isHoliday: true, name: "Juneteenth" };
  if (month === 6 && day === 4) return { isHoliday: true, name: "Independence Day" };
  if (month === 10 && day === 11) return { isHoliday: true, name: "Veterans Day" };
  if (month === 11 && day === 25) return { isHoliday: true, name: "Christmas" };

  // MLK Day: 3rd Monday of January
  if (month === 0 && dayOfWeek === 1) {
    const firstMonday = new Date(year, 0, 1);
    while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
    const thirdMonday = new Date(firstMonday);
    thirdMonday.setDate(firstMonday.getDate() + 14);
    if (day === thirdMonday.getDate()) return { isHoliday: true, name: "MLK Day" };
  }

  // Presidents Day: 3rd Monday of February
  if (month === 1 && dayOfWeek === 1) {
    const firstMonday = new Date(year, 1, 1);
    while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
    const thirdMonday = new Date(firstMonday);
    thirdMonday.setDate(firstMonday.getDate() + 14);
    if (day === thirdMonday.getDate()) return { isHoliday: true, name: "Presidents Day" };
  }

  // Memorial Day: Last Monday of May
  if (month === 4 && dayOfWeek === 1) {
    const lastDay = new Date(year, 5, 0);
    while (lastDay.getDay() !== 1) lastDay.setDate(lastDay.getDate() - 1);
    if (day === lastDay.getDate()) return { isHoliday: true, name: "Memorial Day" };
  }

  // Labor Day: 1st Monday of September
  if (month === 8 && dayOfWeek === 1) {
    const firstMonday = new Date(year, 8, 1);
    while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
    if (day === firstMonday.getDate()) return { isHoliday: true, name: "Labor Day" };
  }

  // Columbus Day: 2nd Monday of October
  if (month === 9 && dayOfWeek === 1) {
    const firstMonday = new Date(year, 9, 1);
    while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
    const secondMonday = new Date(firstMonday);
    secondMonday.setDate(firstMonday.getDate() + 7);
    if (day === secondMonday.getDate()) return { isHoliday: true, name: "Columbus Day" };
  }

  // Thanksgiving: 4th Thursday of November
  if (month === 10 && dayOfWeek === 4) {
    const firstThursday = new Date(year, 10, 1);
    while (firstThursday.getDay() !== 4) firstThursday.setDate(firstThursday.getDate() + 1);
    const fourthThursday = new Date(firstThursday);
    fourthThursday.setDate(firstThursday.getDate() + 21);
    if (day === fourthThursday.getDate()) return { isHoliday: true, name: "Thanksgiving" };
  }

  return { isHoliday: false, name: "" };
};

// Default locations to rotate through
const defaultLocations = [
  "Downtown Library",
  "Westside Community Center",
  "Eastside Park",
  "North End Plaza",
  "South Bay Mall",
  "Central Square",
];

// Generate schedule for upcoming days
const generateSchedule = (daysAhead: number = 14): ScheduleEvent[] => {
  const schedule: ScheduleEvent[] = [];
  const now = new Date();
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  const today = new Date(estString);
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const holiday = isFederalHoliday(date);
    
    const dateStr = date.toISOString().split("T")[0];
    const locationIndex = i % defaultLocations.length;

    if (holiday.isHoliday) {
      schedule.push({
        id: `auto-${dateStr}`,
        date: dateStr,
        location: `Closed - ${holiday.name}`,
        startTime: "",
        endTime: "",
        isClosed: true,
      });
    } else {
      schedule.push({
        id: `auto-${dateStr}`,
        date: dateStr,
        location: defaultLocations[locationIndex],
        startTime: isWeekend ? "11:00" : "16:00",
        endTime: isWeekend ? "15:00" : "20:00",
        isClosed: false,
      });
    }
  }

  return schedule;
};

export const initializeSchedule = () => {
  // Always regenerate schedule to keep it current
  const existingSchedule = localStorage.getItem("schedule");
  if (existingSchedule) {
    // Keep manually added/edited events, regenerate auto ones
    const existing: ScheduleEvent[] = JSON.parse(existingSchedule);
    const manualEvents = existing.filter(e => !e.id.startsWith("auto-"));
    const autoSchedule = generateSchedule(14);
    const combined = [...autoSchedule, ...manualEvents].sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem("schedule", JSON.stringify(combined));
  } else {
    localStorage.setItem("schedule", JSON.stringify(generateSchedule(14)));
  }
};

export const getSchedule = (): ScheduleEvent[] => {
  const schedule = localStorage.getItem("schedule");
  return schedule ? JSON.parse(schedule) : [];
};

export const setSchedule = (schedule: ScheduleEvent[]) => {
  localStorage.setItem("schedule", JSON.stringify(schedule));
};

export const updateScheduleEvent = (event: ScheduleEvent) => {
  const schedule = getSchedule();
  const updatedSchedule = schedule.map(e => e.id === event.id ? event : e);
  setSchedule(updatedSchedule);
};

export const addScheduleEvent = (event: Omit<ScheduleEvent, "id">) => {
  const schedule = getSchedule();
  const newEvent = { ...event, id: Date.now().toString() };
  schedule.push(newEvent);
  setSchedule(schedule);
};

export const deleteScheduleEvent = (id: string) => {
  const schedule = getSchedule();
  const updatedSchedule = schedule.filter(e => e.id !== id);
  setSchedule(updatedSchedule);
};
