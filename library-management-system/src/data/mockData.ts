export type Role = 'admin' | 'librarian' | 'student';
export type BookStatus = 'Available' | 'Borrowed';
export type TransactionStatus = 'Active' | 'Overdue' | 'Returned';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
  activeLoans: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  coverUrl: string;
  published: string;
  pages: number;
  isbn: string;
  description: string;
  waitlist?: string[];
}

export interface Transaction {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  status: TransactionStatus;
}

export const initialUsers: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'admin', joined: '2024-01-15', activeLoans: 2 },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'student', joined: '2024-02-20', activeLoans: 3 },
  { id: 'u3', name: 'Bob Johnson', email: 'bob@example.com', role: 'student', joined: '2024-03-10', activeLoans: 1 },
  { id: 'u4', name: 'Alice Williams', email: 'alice@example.com', role: 'student', joined: '2024-04-05', activeLoans: 0 },
  { id: 'u5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', joined: '2024-04-10', activeLoans: 2 },
];

export const initialNotifications: Notification[] = [];

export const initialBooks: Book[] = [
  {
    id: 'b1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    status: 'Available',
    coverUrl: 'https://picsum.photos/seed/gatsby/400/600',
    published: '1925',
    pages: 180,
    isbn: '978-0-7432-7356-5',
    description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.'
  },
  {
    id: 'b2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    status: 'Borrowed',
    coverUrl: 'https://picsum.photos/seed/mockingbird/400/600',
    published: '1960',
    pages: 281,
    isbn: '978-0-06-112008-4',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.'
  },
  {
    id: 'b3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Fiction',
    status: 'Available',
    coverUrl: 'https://picsum.photos/seed/1984/400/600',
    published: '1949',
    pages: 328,
    isbn: '978-0-452-28423-4',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.'
  },
  {
    id: 'b4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    status: 'Available',
    coverUrl: 'https://picsum.photos/seed/pride/400/600',
    published: '1813',
    pages: 279,
    isbn: '978-0-14-143951-8',
    description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.'
  },
  {
    id: 'b5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    status: 'Borrowed',
    coverUrl: 'https://picsum.photos/seed/catcher/400/600',
    published: '1951',
    pages: 277,
    isbn: '978-0-316-76948-8',
    description: 'The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.'
  },
  {
    id: 'b6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'History',
    status: 'Available',
    coverUrl: 'https://picsum.photos/seed/sapiens/400/600',
    published: '2011',
    pages: 443,
    isbn: '978-0-06-231609-7',
    description: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens.'
  },
  {
    id: 'b7',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Tech',
    status: 'Borrowed',
    coverUrl: 'https://picsum.photos/seed/cleancode/400/600',
    published: '2008',
    pages: 464,
    isbn: '978-0-13-235088-4',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.'
  }
];

export const initialTransactions: Transaction[] = [
  { id: 't1', bookId: 'b1', userId: 'u2', borrowDate: '2026-03-29', dueDate: '2026-04-12', status: 'Returned' },
  { id: 't2', bookId: 'b2', userId: 'u3', borrowDate: '2026-03-25', dueDate: '2026-04-08', status: 'Overdue' },
  { id: 't3', bookId: 'b5', userId: 'u2', borrowDate: '2026-04-01', dueDate: '2026-04-15', status: 'Active' },
  { id: 't4', bookId: 'b6', userId: 'u5', borrowDate: '2026-03-20', dueDate: '2026-04-03', status: 'Returned' },
  { id: 't5', bookId: 'b7', userId: 'u1', borrowDate: '2026-04-05', dueDate: '2026-04-19', status: 'Active' },
];
