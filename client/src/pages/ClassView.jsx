import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignmentCard from '../components/AssignmentCard';
import {
  PlusIcon,
  PrinterIcon,
  ShareIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const ClassView = () => {
  const { classId } = useParams();

  const { data: classData, isLoading, error } = useQuery(
    ['class', classId],
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes/${classId}`).then(res => res.data)
  );

  const { data: assignments, isLoading: assignmentsLoading } = useQuery(
    ['classAssignments', classId],
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/assignments/class/${classId}`).then(res => res.data)
  );

  if (isLoading || assignmentsLoading) {
    return <LoadingSpinner text="Loading class details..." />;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="card">
          <ExclamationCircleIcon className="h-16 w-16 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">
            The class you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(classUrl);
        toast.success('Class link copied to clipboard!');
      } catch (error) {
        console.log('Copy failed');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Class Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {classData.name}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-lg text-gray-600  dark:text-gray-400">{classData.subject}</span>
              <span className="text-sm text-gray-500 ">•</span>
              <span className="text-sm text-gray-500  dark:text-gray-400">
                Created {new Date(classData.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Student Access Code:</span>
              <span className="text-lg font-bold text-primary-600 bg-primary-100 px-3 py-1 rounded-lg">
                {classData.passcode}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to={`/create-assignment?classId=${classData._id}`}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Assignment</span>
            </Link>
            
            <Link
              to={`/print-slip/${classData._id}`}
              className="btn-outline flex items-center space-x-2"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Print Slip</span>
            </Link>
            
            <button
              onClick={handleShare}
              className="btn-outline flex items-center space-x-2"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600  dark:text-gray-100">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900  dark:text-gray-400">{assignments?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-100">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">
                {assignments?.filter(a => {
                  const now = new Date();
                  return new Date(a.availableFrom) <= now && new Date(a.expiresAt) >= now;
                }).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-100">Expired Assignments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">
                {assignments?.filter(a => new Date(a.expiresAt) < new Date()).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Assignments ({assignments?.length || 0})
          </h2>
          <Link
            to={`/create-assignment?classId=${classData._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create New Assignment
          </Link>
        </div>

        {!assignments || assignments.length === 0 ? (
          <div className="card text-center">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first assignment to share with students in this class
            </p>
            <Link
              to={`/create-assignment?classId=${classData._id}`}
              className="btn-primary"
            >
              Create First Assignment
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id} 
                assignment={assignment} 
                isStudent={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Student Access Info */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-4 dark:text-blue-100">
          Student Access Information
        </h3>
        <div className="space-y-3 text-sm text-blue-800 ">
          <div className="flex items-start space-x-3">
            <span className="font-medium">Passcode:</span>
            <span className="font-mono text-lg bg-blue-100 px-2 py-1 rounded ">
              {classData.passcode}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="font-medium">Student Link:</span>
            <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded break-all">
              {window.location.origin}/class/{classData.passcode}
            </span>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <p className="text-blue-700">
              <strong>Share with students:</strong> Give them the passcode "{classData.passcode}" 
              or share the link above. They don't need to create an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassView;