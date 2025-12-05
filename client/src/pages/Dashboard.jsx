import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ClassCard from '../components/ClassCard';
import AssignmentCard from '../components/AssignmentCard';
import {
  PlusIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: classes, isLoading: classesLoading } = useQuery(
    'classes',
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes`).then(res => res.data)
  );

  const { data: assignments, isLoading: assignmentsLoading } = useQuery(
    'assignments',
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/assignments`).then(res => res.data)
  );

  if (classesLoading || assignmentsLoading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const totalClasses = classes?.length || 0;
  const totalAssignments = assignments?.length || 0;
  const activeAssignments = assignments?.filter(assignment => {
    const now = new Date();
    return new Date(assignment.availableFrom) <= now &&
           new Date(assignment.expiresAt) >= now;
  }).length || 0;

  const recentAssignments = assignments?.slice(0, 5) || [];

  return (
    <div className="space-y-10 px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'Teacher'}!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your classes and assignments from your dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/create-class" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-1" />
            New Class
          </Link>
          <Link to="/create-assignment" className="btn-secondary">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
            New Assignment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <AcademicCapIcon className="h-6 w-6 text-primary-600" />,
            label: 'Total Classes',
            value: totalClasses
          },
          {
            icon: <ClipboardDocumentListIcon className="h-6 w-6 text-secondary-600" />,
            label: 'Total Assignments',
            value: totalAssignments
          },
          {
            icon: <ArrowTrendingUpIcon className="h-6 w-6 text-accent-600" />,
            label: 'Active Assignments',
            value: activeAssignments
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center shadow-sm">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Classes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Classes</h2>
            <Link to="/create-class" className="text-primary-600 hover:text-primary-700 font-medium">
              Create New Class
            </Link>
          </div>
          {totalClasses === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg text-center">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No classes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first class to get started
              </p>
              <Link to="/create-class" className="btn-primary">
                Create Your First Class
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map(classData => (
                <ClassCard key={classData._id} classData={classData} isTeacher={true} />
              ))}
            </div>
          )}
        </div>

        {/* Assignments */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Assignments</h2>
            <Link to="/create-assignment" className="text-primary-600 hover:text-primary-700 font-medium">
              Create New Assignment
            </Link>
          </div>
          {totalAssignments === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No assignments yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first assignment to share with students
              </p>
              <Link to="/create-assignment" className="btn-primary">
                Create Your First Assignment
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {recentAssignments.map(assignment => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              to: "/create-class",
              icon: <AcademicCapIcon className="h-8 w-8 text-primary-600 mr-3" />,
              title: "Create Class",
              desc: "Add a new class"
            },
            {
              to: "/create-assignment",
              icon: <ClipboardDocumentListIcon className="h-8 w-8 text-secondary-600 mr-3" />,
              title: "Create Assignment",
              desc: "Add a new assignment"
            },
            {
              to: "/classes",
              icon: <UserGroupIcon className="h-8 w-8 text-accent-600 mr-3" />,
              title: "Public Classes",
              desc: "View all classes"
            },
            {
              icon: <ArrowTrendingUpIcon className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-3" />,
              title: "Analytics",
              desc: "Coming soon"
            }
          ].map((action, idx) =>
            action.to ? (
              <Link
                key={idx}
                to={action.to}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {action.icon}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                </div>
              </Link>
            ) : (
              <div
                key={idx}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-not-allowed opacity-70"
              >
                {action.icon}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
