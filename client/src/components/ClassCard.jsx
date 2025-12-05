import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  UsersIcon,
  EyeIcon,
  PrinterIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClassCard = ({ classData, isTeacher = false }) => {
  const queryClient = useQueryClient();

  const assignmentCount = classData.assignments?.length || 0;
  const activeAssignments = classData.assignments?.filter(assignment => {
    const now = new Date();
    return new Date(assignment.availableFrom) <= now &&
           new Date(assignment.expiresAt) >= now;
  }).length || 0;

  const handleShare = async () => {
    const classUrl = `${window.location.origin}/class/${classData.passcode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${classData.name} - AssignmentHub`,
          text: `Join ${classData.name} class with passcode: ${classData.passcode}`,
          url: classUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(classUrl);
        toast.success('Class link copied to clipboard!');
      } catch (error) {
        console.log('Copy failed');
      }
    }
  };

  const deleteClassMutation = useMutation(
    () => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/classes/${classData._id}`),
    {
      onSuccess: () => {
        toast.success('Class deleted');
        queryClient.invalidateQueries('classes');
      },
      onError: () => {
        toast.error('Failed to delete class');
      }
    }
  );

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${classData.name}"?`)) {
      deleteClassMutation.mutate();
    }
  };

  return (
    <div className="card animate-fade-in bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow">
      <div className="card-header mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {classData.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {classData.subject}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {classData.passcode}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Passcode</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <AcademicCapIcon className="h-4 w-4" />
            <span>{assignmentCount} assignments</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-600 dark:text-accent-400">
            <UsersIcon className="h-4 w-4" />
            <span>{activeAssignments} active</span>
          </div>
        </div>

        {/* Teacher Info */}
        {!isTeacher && classData.teacher && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Teacher:</span> {classData.teacher.name}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {isTeacher ? (
            <>
              <Link
                to={`/class-view/${classData._id}`}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Class</span>
              </Link>
              <Link
                to={`/print-slip/${classData._id}`}
                className="btn-outline flex items-center space-x-2"
              >
                <PrinterIcon className="h-4 w-4" />
              </Link>
              <button
                onClick={handleShare}
                className="btn-outline flex items-center space-x-2"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="btn-outline text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-2"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/class/${classData.passcode}`}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Assignments</span>
              </Link>
              <button
                onClick={handleShare}
                className="btn-outline flex items-center space-x-2"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
