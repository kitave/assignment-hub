import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ClockIcon, 
  DevicePhoneMobileIcon,
  PrinterIcon,
  ShareIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Easy Assignment Management',
      description: 'Teachers can create and manage assignments with deadlines, files, and instructions.'
    },
    {
      icon: UserGroupIcon,
      title: 'Student Access via Passcode',
      description: 'Students access classes using simple passcodes - no registration required.'
    },
    {
      icon: ClockIcon,
      title: 'Deadline Tracking',
      description: 'Built-in countdown timers help students stay aware of assignment deadlines.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Friendly',
      description: 'Works perfectly on smartphones and tablets for on-the-go access.'
    },
    {
      icon: PrinterIcon,
      title: 'Printable Slips',
      description: 'Generate printable assignment slips with QR codes for easy sharing.'
    },
    {
      icon: ShareIcon,
      title: 'Easy Sharing',
      description: 'Share class links and passcodes with students through SMS or other means.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AssignmentHub
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A simple, offline-friendly platform for Kenyan high school teachers 
            to share assignments with students during holidays. No complicated 
            sign-ups for students - just enter a passcode and get started!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/create-class" className="btn-outline">
                Create New Class
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Get Started as Teacher
              </Link>
              <Link to="/classes" className="btn-outline">
                View Public Classes
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose AssignmentHub?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built specifically for the Kenyan education system, focusing on 
            simplicity and accessibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 ">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Simple steps to get started with AssignmentHub
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Teachers */}
          <div>
            <h3 className="text-2xl font-semibold text-primary-600 mb-6 dark:text-white">
              For Teachers
            </h3>
            <div className="space-y-4">
              {[
                'Register & Login',
                'Create Classes',
                'Post Assignments',
                'Share with Students'
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{step}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {[
                        'Create your teacher account and log in',
                        'Set up classes with unique passcodes',
                        'Add assignments with files, deadlines, and instructions',
                        'Print slips or send passcodes via SMS'
                      ][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary-600 mb-6  dark:text-white">
              For Students
            </h3>
            <div className="space-y-4">
              {[
                'Get Passcode',
                'Enter Passcode',
                'View Assignments',
                'Download & Complete'
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{step}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {[
                        'Receive class passcode from your teacher',
                        'Type the passcode to access your class',
                        'See all available assignments and deadlines',
                        'Download files and complete assignments'
                      ][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center gradient-bg bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-black dark:text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of teachers and students already using AssignmentHub 
          to make education more accessible.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Register as Teacher
              </Link>
              <Link 
                to="/classes" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Browse Classes
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
