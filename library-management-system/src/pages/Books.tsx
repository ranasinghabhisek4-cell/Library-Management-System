import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Book } from '../data/mockData';

export default function Books() {
  const { books, user, addBook, updateBook, deleteBook } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All Genres');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '', author: '', genre: 'Fiction', coverUrl: '', published: '', pages: 0, isbn: '', description: ''
  });

  const genres = ['All Genres', 'Fiction', 'Science', 'History', 'Tech', 'Art'];
  const statuses = ['All Status', 'Available', 'Borrowed'];

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', genre: 'Fiction', coverUrl: '', published: '', pages: 0, isbn: '', description: '' });
    setShowBookModal(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title, author: book.author, genre: book.genre, coverUrl: book.coverUrl,
      published: book.published, pages: book.pages, isbn: book.isbn, description: book.description
    });
    setShowBookModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    setShowBookModal(false);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'All Genres' || book.genre === genreFilter;
    const matchesStatus = statusFilter === 'All Status' || book.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Book Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">Browse and search library collection</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-gray-50"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 sm:w-auto">
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="block w-full sm:w-48 rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white flex-1"
          >
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-48 rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white flex-1"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-gray-200">
          {filteredBooks.map((book) => (
            <div key={book.id} className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-24 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <img className="h-full w-full object-cover" src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {book.genre}
                    </span>
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      book.status === 'Available' ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                    )}>
                      {book.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <Link to={`/books/${book.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500 py-2">
                  View Details
                </Link>
                {user?.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(book)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Edit Book">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Delete Book">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No books matching your criteria.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Genre</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
                        <img className="h-full w-full object-cover" src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      book.status === 'Available' ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                    )}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <Link to={`/books/${book.id}`} className="text-gray-900 hover:text-blue-600 transition-colors font-semibold">
                        View Details
                      </Link>
                      {user?.role === 'admin' && (
                        <>
                          <button onClick={() => handleOpenEdit(book)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Book">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteBook(book.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete Book">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Author</label>
                  <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Genre</label>
                  <select value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                    {genres.filter(g => g !== 'All Genres').map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Cover URL</label>
                  <input type="url" required value={formData.coverUrl} onChange={e => setFormData({...formData, coverUrl: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Published Year</label>
                  <input type="text" required value={formData.published} onChange={e => setFormData({...formData, published: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Pages</label>
                  <input type="number" required value={formData.pages} onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 0})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">ISBN</label>
                  <input type="text" required value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowBookModal(false)} className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">{editingBook ? 'Save Changes' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
