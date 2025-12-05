import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { DocumentPlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: '',
    availableFrom: '',
    expiresAt: '',
    submissionInstructions: '',
    teacherNotes: '',
    classId: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: classes, isLoading: classesLoading } = useQuery(
    'classes',
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes`).then(res => res.data)
  );

  const createAssignmentMutation = useMutation(
    (assignmentData) => {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(assignmentData).forEach(key => {
        if (key !== 'file') {
          formDataToSend.append(key, assignmentData[key]);
        }
      });
      
      // Append file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }
      
      return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/assignments`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
        toast.success('Assignment created successfully!');
        navigate('/dashboard');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create assignment';
        toast.error(message);
      }
    }
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Assignment description is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiration date is required';
    } else if (new Date(formData.expiresAt) <= new Date(formData.deadline)) {
      newErrors.expiresAt = 'Expiration date must be after deadline';
    }

    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    createAssignmentMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only images, PDFs, and documents are allowed');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  if (classesLoading) {
    return <div className="text-center">Loading classes...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card ">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-gray-900 ">Create New Assignment</h2>
          <p className="text-gray-600 mt-1">
            Create a new assignment for your students with files and instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="form-label">
                Assignment Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="form-input"
                placeholder="e.g., Mathematics Holiday Assignment"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
              
            </div>

            <div>
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="form-input"
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
              {errors.subject && <p className="form-error">{errors.subject}</p>}
              
            </div>
          </div>

          <div>
            <label htmlFor="classId" className="form-label">
              Select Class
            </label>
            <select
              id="classId"
              name="classId"
              required
              className="form-input"
              value={formData.classId}
              onChange={handleChange}
            >
              <option value="">Select a class</option>
              {classes?.map((classData) => (
                <option key={classData._id} value={classData._id}>
                  {classData.name} - {classData.subject} ({classData.passcode})
                </option>
              ))}
            </select>
            {errors.classId && <p className="form-error">{errors.classId}</p>}
            
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Assignment Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="form-textarea"
              placeholder="Describe the assignment, what students need to do, and any important details..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
            
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="availableFrom" className="form-label">
                Available From
              </label>
              <input
                id="availableFrom"
                name="availableFrom"
                type="datetime-local"
                className="form-input"
                value={formData.availableFrom || getCurrentDateTime()}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-600 mt-1">
                When students can start seeing this assignment
              </p>
            </div>

            <div>
              <label htmlFor="deadline" className="form-label">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="datetime-local"
                required
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && <p className="form-error">{errors.deadline}</p>}
              
            </div>

            <div>
              <label htmlFor="expiresAt" className="form-label">
                Expires At
              </label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                required
                className="form-input"
                value={formData.expiresAt}
                onChange={handleChange}
              />
              {errors.expiresAt && <p className="form-error">{errors.expiresAt}</p>}
              
              <p className="text-sm text-gray-600 mt-1">
                When this assignment will no longer be visible
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="file" className="form-label">
              Attachment (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="form-input"
              />
              <ArrowUpTrayIcon className="h-5 w-5 text-gray-400" />
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              Upload images, PDFs, or documents (max 10MB)
            </p>
          </div>

          <div>
            <label htmlFor="submissionInstructions" className="form-label">
              Submission Instructions
            </label>
            <textarea
              id="submissionInstructions"
              name="submissionInstructions"
              rows={3}
              className="form-textarea"
              placeholder="Tell students how to submit their work (e.g., submit via email, bring to class, etc.)"
              value={formData.submissionInstructions}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="teacherNotes" className="form-label">
              Teacher Notes (Private)
            </label>
            <textarea
              id="teacherNotes"
              name="teacherNotes"
              rows={3}
              className="form-textarea"
              placeholder="Private notes for yourself (students won't see this)"
              value={formData.teacherNotes}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-600 mt-1">
              These notes are only visible to you and will not be shown to students
            </p>
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
              disabled={createAssignmentMutation.isLoading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span>
                {createAssignmentMutation.isLoading ? 'Creating...' : 'Create Assignment'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;