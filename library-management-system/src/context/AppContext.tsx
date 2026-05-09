import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Book, Transaction, Notification, initialUsers, initialBooks, initialTransactions, initialNotifications } from '../data/mockData';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'joined' | 'activeLoans'>) => void;
  deleteUser: (id: string) => void;
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'status'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  transactions: Transaction[];
  markAsReturned: (transactionId: string) => void;
  borrowBook: (bookId: string, userId: string) => void;
  joinWaitlist: (bookId: string, userId: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUsers[0]); // Default logged in as admin
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const login = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // For demo, just log in as admin if not found
      setUser(users[0]);
    }
  };

  const logout = () => setUser(null);

  const addUser = (newUser: Omit<User, 'id' | 'joined' | 'activeLoans'>) => {
    const user: User = {
      ...newUser,
      id: `u${users.length + 1}`,
      joined: new Date().toISOString().split('T')[0],
      activeLoans: 0
    };
    setUsers([...users, user]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addBook = (newBook: Omit<Book, 'id' | 'status'>) => {
    const book: Book = {
      ...newBook,
      id: `b${books.length + 1}`,
      status: 'Available'
    };
    setBooks([...books, book]);
  };

  const updateBook = (id: string, updatedFields: Partial<Book>) => {
    setBooks(books.map(b => b.id === id ? { ...b, ...updatedFields } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  const joinWaitlist = (bookId: string, userId: string) => {
    setBooks(books.map(b => {
      if (b.id === bookId) {
        const currentWaitlist = b.waitlist || [];
        if (!currentWaitlist.includes(userId)) {
          return { ...b, waitlist: [...currentWaitlist, userId] };
        }
      }
      return b;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAsReturned = (transactionId: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'Returned' } : t
    ));
    
    // Update book status and handle waitlist notifications
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      const book = books.find(b => b.id === transaction.bookId);
      
      setBooks(books.map(b => b.id === transaction.bookId ? { ...b, status: 'Available', waitlist: [] } : b));
      
      if (book && book.waitlist && book.waitlist.length > 0) {
        const newNotifs = book.waitlist.map((uid, idx) => ({
          id: `n${Date.now()}${idx}`,
          userId: uid,
          message: `The book "${book.title}" you are interested in is now available!`,
          date: new Date().toISOString(),
          read: false,
          actionUrl: `/books/${book.id}`
        }));
        
        setNotifications(prev => [...prev, ...newNotifs]);
      }
    }
  };

  const borrowBook = (bookId: string, userId: string) => {
    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      bookId,
      userId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active'
    };
    setTransactions([...transactions, newTransaction]);
    setBooks(books.map(b => b.id === bookId ? { ...b, status: 'Borrowed' } : b));
  };

  return (
    <AppContext.Provider value={{ user, login, logout, users, addUser, deleteUser, books, addBook, updateBook, deleteBook, transactions, markAsReturned, borrowBook, joinWaitlist, notifications, markNotificationRead }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
