import React, { useState } from 'react';
import { Calendar, User as UserIcon, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { format, differenceInDays } from 'date-fns';

export default function Transactions() {
  const { transactions, books, users, markAsReturned } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const statuses = ['All Status', 'Active', 'Overdue', 'Returned'];

  const filteredTransactions = transactions.filter(t => 
    statusFilter === 'All Status' || t.status === statusFilter
  );

  const handleReturn = (id: string) => {
    markAsReturned(id);
    setShowConfirmModal(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {showSuccessToast && (
        <div className="absolute top-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle2 className="w-5 h-5 text-gray-900" />
          <p className="text-sm font-medium text-gray-900">Book returned successfully</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Transactions</h2>
        <p className="text-sm text-gray-500 mt-1">Track all borrow and return activities</p>
      </div>

      <div className="flex">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-48 rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Borrow Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTransactions.map((transaction) => {
                const book = books.find(b => b.id === transaction.bookId);
                const user = users.find(u => u.id === transaction.userId);
                
                if (!book || !user) return null;

                const daysRemaining = differenceInDays(new Date(transaction.dueDate), new Date());

                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {format(new Date(transaction.borrowDate), 'M/d/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {format(new Date(transaction.dueDate), 'M/d/yyyy')}
                        </div>
                        {transaction.status === 'Active' && (
                          <span className="text-xs text-gray-400 mt-1 ml-6">{daysRemaining} days remaining</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        transaction.status === 'Active' ? "bg-green-50 text-green-700" : 
                        transaction.status === 'Overdue' ? "bg-red-50 text-red-700" : 
                        "bg-blue-600 text-white"
                      )}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status !== 'Returned' && (
                        <button 
                          onClick={() => setShowConfirmModal(transaction.id)}
                          className="text-gray-900 hover:text-blue-600 transition-colors font-semibold"
                        >
                          Mark as Returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Return</h3>
              <button onClick={() => setShowConfirmModal(null)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Review the return details and any applicable fees</p>
            
            {(() => {
              const t = transactions.find(tx => tx.id === showConfirmModal);
              const b = books.find(bk => bk.id === t?.bookId);
              const u = users.find(ur => ur.id === t?.userId);
              if (!t || !b || !u) return null;
              
              return (
                <div className="space-y-4">
                  <p className="font-medium text-gray-900">
                    Confirm return of <span className="font-bold">{b.title}</span> by <span className="font-bold">{u.name}</span>?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Borrow Date</span>
                      <span className="text-gray-900">{format(new Date(t.borrowDate), 'M/d/yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Due Date</span>
                      <span className="text-gray-900">{format(new Date(t.dueDate), 'M/d/yyyy')}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturn(showConfirmModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
