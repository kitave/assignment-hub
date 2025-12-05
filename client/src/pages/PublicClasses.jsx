import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ClassCard from '../components/ClassCard';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const PublicClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');

  const { data: classes, isLoading, error } = useQuery(
    'publicClasses',
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/student/classes/public`).then(res => res.data),
    {
      onError: (error) => {
        toast.error('Failed to load classes');
      }
    }
  );

  const handleQuickAccess = (e) => {
    e.preventDefault();
    if (passcodeInput.trim()) {
      window.location.href = `/class/${passcodeInput.trim().toUpperCase()}`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading public classes..." />;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="card">
          <h2 className="text-xl font-bold text-danger-600 mb-2">
            Unable to Load Classes
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading the public classes. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter classes based on search term and subject
  const filteredClasses = classes?.filter(classData => {
    const matchesSearch = searchTerm === '' || 
      classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.passcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || classData.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  }) || [];

  // Get unique subjects for filter
  const subjects = [...new Set(classes?.map(c => c.subject) || [])].sort();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Public Classes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse all available classes or enter a passcode to access a specific class directly
        </p>
      </div>

      {/* Quick Access */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Access
        </h2>
        <form onSubmit={handleQuickAccess} className="flex space-x-4">
          <div className="flex-1 relative">
            <KeyIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter class passcode (e.g., ABC123)"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value.toUpperCase())}
              className="form-input pl-10"
              maxLength={8}
            />
          </div>
          <button type="submit" className="btn-primary">
            Go to Class
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Browse All Classes
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search classes, teachers, or passcodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="form-input"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
          <div className="card text-center">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {classes?.length === 0 ? 'No classes available' : 'No classes found'}
            </h3>
            <p className="text-gray-600">
              {classes?.length === 0 
                ? 'Teachers haven\'t created any classes yet. Check back later!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classData) => (
                <ClassCard 
                  key={classData._id} 
                  classData={classData} 
                  isTeacher={false}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="card bg-green-50 border-green-200">
        <h3 className="text-lg font-medium text-green-900 mb-4">
          How to Access Classes
        </h3>
        <div className="space-y-2 text-sm text-green-800">
          <p><strong>Method 1:</strong> Enter the passcode your teacher gave you in the Quick Access box above</p>
          <p><strong>Method 2:</strong> Browse through all available classes and click "View Assignments"</p>
          <p><strong>Method 3:</strong> If you have a QR code, scan it with your phone camera</p>
          <p><strong>Tip:</strong> Bookmark classes you frequently visit for quick access</p>
        </div>
      </div>
    </div>
  );
};

export default PublicClasses;