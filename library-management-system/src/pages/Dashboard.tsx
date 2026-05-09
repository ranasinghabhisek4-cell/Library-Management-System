import React from 'react';
import { BookOpen, Users, ArrowRightLeft, BookMarked } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';

const borrowData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 61 },
  { name: 'Apr', value: 58 },
  { name: 'May', value: 68 },
  { name: 'Jun', value: 75 },
];

const genreData = [
  { name: 'Fiction', value: 120 },
  { name: 'Science', value: 85 },
  { name: 'History', value: 65 },
  { name: 'Tech', value: 95 },
  { name: 'Art', value: 45 },
];

export default function Dashboard() {
  const { books, users, transactions } = useAppContext();

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.status === 'Available').length;
  const activeUsers = users.length;
  const activeBorrows = transactions.filter(t => t.status === 'Active' || t.status === 'Overdue').length;

  const stats = [
    { name: 'Total Books', value: '1,248', icon: BookOpen, change: '+12%', changeType: 'positive' },
    { name: 'Available', value: '892', icon: BookMarked, change: '+71%', changeType: 'positive', iconColor: 'text-green-600', iconBg: 'bg-green-50' },
    { name: 'Active Users', value: '324', icon: Users, change: '+8%', changeType: 'positive', iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
    { name: 'Active Borrows', value: '156', icon: ArrowRightLeft, change: '+5%', changeType: 'positive', iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Library overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBg || 'bg-blue-50'}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor || 'text-blue-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                <svg className="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Borrow Trends</h3>
          <p className="text-sm text-gray-500 mb-6">Monthly borrow activity</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={borrowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Books by Genre</h3>
          <p className="text-sm text-gray-500 mb-6">Collection distribution</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
