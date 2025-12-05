import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    passcode: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createClassMutation = useMutation(
    (classData) => axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/classes`, classData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
        toast.success('Class created successfully!');
        navigate('/dashboard');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create class';
        toast.error(message);
      }
    }
  );

  const generatePasscodeMutation = useMutation(
    () => axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/classes/generate-passcode`),
    {
      onSuccess: (response) => {
        setFormData(prev => ({ ...prev, passcode: response.data.passcode }));
        toast.success('New passcode generated!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to generate passcode';
        toast.error(message);
      }
    }
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.passcode.trim()) newErrors.passcode = 'Passcode is required';
    else if (formData.passcode.length < 4) newErrors.passcode = 'Passcode must be at least 4 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createClassMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGeneratePasscode = () => {
    generatePasscodeMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Class</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Set up a new class for your students with a unique passcode
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Class Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:border-blue-400"
              placeholder="e.g., Form 4 East, Chemistry Class"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:border-blue-400"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select a subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Kiswahili">Kiswahili</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Computer Studies">Computer Studies</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Art & Design">Art & Design</option>
              <option value="Music">Music</option>
              <option value="Physical Education">Physical Education</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Class Passcode
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                id="passcode"
                name="passcode"
                type="text"
                required
                className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:border-blue-400"
                placeholder="Enter unique passcode"
                value={formData.passcode}
                onChange={handleChange}
                maxLength={8}
                style={{ textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={handleGeneratePasscode}
                disabled={generatePasscodeMutation.isLoading}
                className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-zinc-700 dark:text-blue-400"
              >
                <ArrowPathIcon className={`h-4 w-4 mr-1 ${generatePasscodeMutation.isLoading ? 'animate-spin' : ''}`} />
                Generate
              </button>
            </div>
            {errors.passcode && <p className="text-red-500 text-sm mt-1">{errors.passcode}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Students will use this passcode to access the class. Keep it simple and memorable.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Class Preview</h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Name:</strong> {formData.name || 'Class name will appear here'}</p>
              <p><strong>Subject:</strong> {formData.subject || 'Subject will appear here'}</p>
              <p><strong>Passcode:</strong> {formData.passcode || 'Passcode will appear here'}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClassMutation.isLoading}
              className="btn-primary flex-1"
            >
              {createClassMutation.isLoading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
