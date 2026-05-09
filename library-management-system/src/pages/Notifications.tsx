import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export default function Notifications() {
  const { user, notifications, markNotificationRead } = useAppContext();

  const userNotifications = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (userNotifications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">Stay updated on your library activities</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">Stay updated on your library activities</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <ul role="list" className="divide-y divide-gray-200">
          {userNotifications.map((notification) => (
            <li
              key={notification.id}
              className={cn(
                "relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 transition-colors",
                !notification.read && "bg-blue-50/50 hover:bg-blue-50"
              )}
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className={cn(
                    "text-sm leading-6 text-gray-900",
                    !notification.read && "font-semibold"
                  )}>
                    {notification.message}
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-end gap-x-4">
                {!notification.read && (
                  <button
                    onClick={() => markNotificationRead(notification.id)}
                    className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as read
                  </button>
                )}
                {notification.actionUrl && (
                  <Link
                    to={notification.actionUrl}
                    className="flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
