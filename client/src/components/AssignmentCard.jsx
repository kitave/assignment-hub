import React from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import {
  ClockIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  TrashIcon, 
} from '@heroicons/react/24/outline';
import CountdownTimer from './CountdownTimer';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignmentCard = ({ assignment, isStudent = false, onDelete }) => {
  const now = new Date();
  const deadline = new Date(assignment.deadline);
  const isExpired = isAfter(now, deadline);
  const isActive = !isExpired && isBefore(now, new Date(assignment.expiresAt));

  const getStatusBadge = () => {
    if (isExpired) {
      return <span className="status-expired">Expired</span>;
    }
    if (isActive) {
      return <span className="status-active">Active</span>;
    }
    return <span className="status-pending">Pending</span>;
  };

  const handleDownload = () => {
    if (assignment.file) {
      const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${assignment.file.filename}`;
      window.open(fileUrl, '_blank');
    }
  };

  // ✅ Handle delete for teachers
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/assignments/${assignment._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Assignment deleted successfully');
      if (onDelete) onDelete(); // trigger a refetch or removal
    } catch (error) {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div className="card animate-fade-in relative">
      {/* 🗑️ Delete icon top-right (teacher only) */}
      {!isStudent && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title="Delete Assignment"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}

      <div className="card-header">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-white">{assignment.subject}</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 dark:text-white">{assignment.description}</p>

        {/* Deadline Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 dark:text-white" />
          <span className="dark:text-white">Due: {format(deadline, 'PPP p')}</span>
        </div>

        {/* Countdown Timer */}
        {!isExpired && <CountdownTimer deadline={deadline} />}

        {/* File Download */}
        {assignment.file && (
          <div className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-5 w-5 text-primary-600" />
            <button
              onClick={handleDownload}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Download {assignment.file.originalName}
            </button>
          </div>
        )}

        {/* Submission Instructions */}
        {assignment.submissionInstructions && (
          <div className="bg-blue-50 p-4 rounded-lg dark:bg-gray-900">
            <h4 className="font-medium text-blue-900 mb-2 dark:text-white">
              Submission Instructions:
            </h4>
            <p className="text-blue-800 text-sm dark:text-blue-500">
              {assignment.submissionInstructions}
            </p>
          </div>
        )}

        {/* Teacher Notes (only for teachers) */}
        {!isStudent && assignment.teacherNotes && (
          <div className="bg-yellow-50 p-4 rounded-lg dark:bg-gray-900">
            <h4 className="font-medium text-yellow-900 mb-2 dark:text-yellow-500">Teacher Notes:</h4>
            <p className="text-yellow-800 text-sm dark:text-yellow-700">{assignment.teacherNotes}</p>
          </div>
        )}

        {/* Warning for expired assignments */}
        {isExpired && (
          <div className="flex items-center space-x-2 text-danger-600 bg-danger-50 p-3 rounded-lg">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              This assignment has expired
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
