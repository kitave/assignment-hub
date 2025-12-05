import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import QRCode from 'react-qr-code';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { PrinterIcon } from '@heroicons/react/24/outline';

const PrintSlip = () => {
  const { classId } = useParams();

  const { data: printData, isLoading, error } = useQuery(
    ['printSlip', classId],
    () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/print/slip/${classId}`).then(res => res.data)
  );

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingSpinner text="Generating print slip..." />;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="card">
          <h2 className="text-xl font-bold text-danger-600 mb-2">
            Unable to Generate Print Slip
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error generating the print slip. Please try again.
          </p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { class: classInfo, assignments, qrCode, classUrl, generatedAt } = printData;

  return (
    <div className="space-y-8">
      {/* Print Button - Hidden in print view */}
      <div className="no-print text-center">
        <button onClick={handlePrint} className="btn-primary flex items-center space-x-2 mx-auto">
          <PrinterIcon className="h-5 w-5" />
          <span>Print Assignment Slip</span>
        </button>
      </div>

      {/* Printable Content */}
      <div className="print-container bg-white">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AssignmentHub
          </h1>
          <p className="text-lg text-gray-600">
            Holiday Assignment Slip
          </p>
        </div>

        {/* Class Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Class Information</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Class:</span>
                <span className="text-gray-900">{classInfo.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Subject:</span>
                <span className="text-gray-900">{classInfo.subject}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Teacher:</span>
                <span className="text-gray-900">{classInfo.teacher}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Passcode:</span>
                <span className="text-2xl font-bold text-primary-600 bg-primary-100 px-3 py-1 rounded">
                  {classInfo.passcode}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Scan for Quick Access
            </h3>
            <div className="inline-block p-4 bg-gray-50 rounded-lg">
              <QRCode value={classUrl} size={150} />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Scan with your phone camera
            </p>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            How to Access Assignments:
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Option 1:</strong> Visit <span className="font-mono">assignmenthub.com</span> and enter passcode: <strong>{classInfo.passcode}</strong></p>
            <p><strong>Option 2:</strong> Scan the QR code above with your phone camera</p>
            <p><strong>Option 3:</strong> Visit directly: <span className="font-mono text-xs break-all">{classUrl}</span></p>
          </div>
        </div>

        {/* Assignments List */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Current Assignments ({assignments.length})
          </h2>
          
          {assignments.length === 0 ? (
            <p className="text-gray-600">No assignments currently available.</p>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {assignment.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {assignment.subject}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {assignment.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Deadline: {format(new Date(assignment.deadline), 'PPP p')}
                    </span>
                    {assignment.file && (
                      <span className="text-primary-600">
                        📎 File attached
                      </span>
                    )}
                  </div>
                  {assignment.submissionInstructions && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <strong>Submission:</strong> {assignment.submissionInstructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
          <p>Generated on {format(new Date(generatedAt), 'PPP p')}</p>
          <p className="mt-1">
            For support, contact your teacher or visit AssignmentHub.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintSlip;