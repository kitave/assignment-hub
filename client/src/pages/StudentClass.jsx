import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignmentCard from '../components/AssignmentCard';
import QRCode from 'react-qr-code';
import {
  BookmarkIcon,
  ShareIcon,
  QrCodeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const StudentClass = () => {
  const { passcode } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { data: classData, isLoading, error } = useQuery(
    ['studentClass', passcode],
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/student/class/${passcode}`).then(res => res.data),
    {
      retry: false,
      onError: (error) => {
        if (error.response?.status === 404) {
          toast.error('Class not found. Please check the passcode and try again.');
        } else {
          toast.error('Failed to load class data');
        }
      }
    }
  );

  useEffect(() => {
    // Check if this class is bookmarked
    const bookmarkedClasses = JSON.parse(localStorage.getItem('bookmarkedClasses') || '[]');
    setIsBookmarked(bookmarkedClasses.includes(passcode));
  }, [passcode]);

  const handleBookmark = () => {
    const bookmarkedClasses = JSON.parse(localStorage.getItem('bookmarkedClasses') || '[]');
    
    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarkedClasses.filter(code => code !== passcode);
      localStorage.setItem('bookmarkedClasses', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.success('Class removed from bookmarks');
    } else {
      // Add bookmark
      bookmarkedClasses.push(passcode);
      localStorage.setItem('bookmarkedClasses', JSON.stringify(bookmarkedClasses));
      setIsBookmarked(true);
      toast.success('Class bookmarked for quick access');
    }
  };

  const handleShare = async () => {
    const classUrl = window.location.href;
    const shareData = {
      title: `${classData.class.name} - AssignmentHub`,
      text: `Check out assignments for ${classData.class.name} (${classData.class.subject})`,
      url: classUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(classUrl);
        toast.success('Class link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading class assignments..." />;
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <ExclamationCircleIcon className="h-16 w-16 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Class Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't find a class with passcode "{passcode}".
            Please check the passcode and try again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
            <a href="/classes" className="btn-outline">
              Browse All Classes
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { class: classInfo, assignments } = classData;

  return (
    <div className="space-y-8">
      {/* Class Header */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {classInfo.name}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-lg text-gray-600 dark:text-gray-300">{classInfo.subject}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Teacher: {classInfo.teacher}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Passcode:</span>
              <span className="text-lg font-bold text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 px-3 py-1 rounded-lg">
                {classInfo.passcode}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isBookmarked 
                  ? 'bg-warning-100 text-warning-600 hover:bg-warning-200 dark:bg-warning-800 dark:text-yellow-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this class'}
            >
              <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 transition-colors duration-200"
              title="Share this class"
            >
              <ShareIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 transition-colors duration-200"
              title="Show QR code"
            >
              <QrCodeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                QR Code for Quick Access
              </h3>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-600">
                <QRCode value={window.location.href} size={200} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
                Share this QR code with other students to give them quick access to this class
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Assignments */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignments ({assignments.length})
          </h2>
          {assignments.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {assignments.filter(a => new Date(a.deadline) > new Date()).length} active assignments
            </div>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="card text-center dark:bg-gray-800 dark:border-gray-700">
            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No assignments available
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your teacher hasn't posted any assignments yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id} 
                assignment={assignment} 
                isStudent={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="card bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">
          Need Help?
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• Bookmark this class to save it for quick access later</p>
          <p>• Share the passcode or QR code with your classmates</p>
          <p>• Check back regularly for new assignments</p>
          <p>• Download any attached files before the deadline</p>
          <p>• Follow the submission instructions carefully</p>
        </div>
      </div>
    </div>
  );
};

export default StudentClass;