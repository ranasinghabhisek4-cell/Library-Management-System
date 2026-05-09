import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, Calendar, FileText, Hash, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, user, borrowBook, joinWaitlist } = useAppContext();

  const book = books.find(b => b.id === id);

  if (!book) {
    return <div>Book not found</div>;
  }

  const isWaitlisted = user && book.waitlist?.includes(user.id);

  const handleBorrow = () => {
    if (user && book.status === 'Available') {
      borrowBook(book.id, user.id);
      navigate('/transactions');
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Cover & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-4">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                book.status === 'Available' ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
              )}>
                {book.status}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBorrow}
                disabled={book.status !== 'Available'}
                className="w-full flex justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 Borrow Book
              </button>
              
              {book.status === 'Borrowed' && user && (
                <button
                  onClick={() => joinWaitlist(book.id, user.id)}
                  disabled={isWaitlisted}
                  className="w-full flex justify-center rounded-lg bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isWaitlisted ? 'You will be notified' : 'Notify Me When Available'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">{book.title}</h1>
            <div className="flex items-center text-gray-500 mb-8">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{book.author}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Tag className="w-3 h-3 mr-1"/> Genre</p>
                <p className="text-sm font-medium text-gray-900">{book.genre}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Published</p>
                <p className="text-sm font-medium text-gray-900">{book.published}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center"><FileText className="w-3 h-3 mr-1"/> Pages</p>
                <p className="text-sm font-medium text-gray-900">{book.pages}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Hash className="w-3 h-3 mr-1"/> ISBN</p>
                <p className="text-sm font-medium text-gray-900">{book.isbn}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Borrowing Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Loan Period</span>
                <span className="text-sm font-medium text-gray-900">14 days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Late Fee</span>
                <span className="text-sm font-medium text-gray-900">$0.50 per day</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Renewals</span>
                <span className="text-sm font-medium text-gray-900">Up to 2 times</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
