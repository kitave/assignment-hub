import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateClass from './pages/CreateClass';
import CreateAssignment from './pages/CreateAssignment';
import ClassView from './pages/ClassView';
import StudentClass from './pages/StudentClass';
import PublicClasses from './pages/PublicClasses';
import PrintSlip from './pages/PrintSlip';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-bg-light">
          <Navbar />
          <main className="container-responsive py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/classes" element={<PublicClasses />} />
              <Route path="/class/:passcode" element={<StudentClass />} />
              
              {/* Protected routes for teachers */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-class" element={
                <ProtectedRoute>
                  <CreateClass />
                </ProtectedRoute>
              } />
              <Route path="/create-assignment" element={
                <ProtectedRoute>
                  <CreateAssignment />
                </ProtectedRoute>
              } />
              <Route path="/class-view/:classId" element={
                <ProtectedRoute>
                  <ClassView />
                </ProtectedRoute>
              } />
              <Route path="/print-slip/:classId" element={
                <ProtectedRoute>
                  <PrintSlip />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;