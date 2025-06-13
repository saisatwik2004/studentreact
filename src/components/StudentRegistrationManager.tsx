import React, { useState } from 'react';
import { Plus, Edit2, Trash2, UserPlus, Check, X, Users, Mail, Phone, Calendar } from 'lucide-react';
import { StudentRegistration, StudentRegistrationFormData } from '../types/StudentRegistration';
import { CourseOffering } from '../types/CourseOffering';

interface StudentRegistrationManagerProps {
  studentRegistrations: StudentRegistration[];
  setStudentRegistrations: React.Dispatch<React.SetStateAction<StudentRegistration[]>>;
  courseOfferings: CourseOffering[];
  setCourseOfferings: React.Dispatch<React.SetStateAction<CourseOffering[]>>;
}

const StudentRegistrationManager: React.FC<StudentRegistrationManagerProps> = ({
  studentRegistrations,
  setStudentRegistrations,
  courseOfferings,
  setCourseOfferings
}) => {
  const [formData, setFormData] = useState<StudentRegistrationFormData>({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    courseOfferingId: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<StudentRegistrationFormData>({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    courseOfferingId: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedOfferingFilter, setSelectedOfferingFilter] = useState<string>('');

  const validateForm = (data: StudentRegistrationFormData): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (data.studentName.trim().length < 2) {
      newErrors.studentName = 'Student name must be at least 2 characters';
    }

    if (!data.studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.studentEmail.trim())) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }

    if (!data.studentPhone.trim()) {
      newErrors.studentPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.studentPhone.trim())) {
      newErrors.studentPhone = 'Please enter a valid phone number';
    }

    if (!data.courseOfferingId) {
      newErrors.courseOfferingId = 'Please select a course offering';
    } else {
      const offering = courseOfferings.find(o => o.id === data.courseOfferingId);
      if (offering && offering.currentStudents >= offering.maxStudents) {
        newErrors.courseOfferingId = 'This course offering is full';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    const offering = courseOfferings.find(o => o.id === formData.courseOfferingId);
    if (!offering) return;

    const newRegistration: StudentRegistration = {
      id: crypto.randomUUID(),
      studentName: formData.studentName.trim(),
      studentEmail: formData.studentEmail.trim().toLowerCase(),
      studentPhone: formData.studentPhone.trim(),
      courseOfferingId: formData.courseOfferingId,
      courseOfferingName: `${offering.courseTypeName} - ${offering.courseName}`,
      registrationDate: new Date(),
      status: 'active'
    };

    setStudentRegistrations(prev => [newRegistration, ...prev]);
    
    // Update course offering student count
    setCourseOfferings(prev =>
      prev.map(o =>
        o.id === formData.courseOfferingId
          ? { ...o, currentStudents: o.currentStudents + 1 }
          : o
      )
    );

    setFormData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseOfferingId: ''
    });
    setErrors({});
  };

  const handleEdit = (registration: StudentRegistration) => {
    setEditingId(registration.id);
    setEditingData({
      studentName: registration.studentName,
      studentEmail: registration.studentEmail,
      studentPhone: registration.studentPhone,
      courseOfferingId: registration.courseOfferingId
    });
  };

  const handleSaveEdit = () => {
    if (!validateForm(editingData)) {
      return;
    }

    const offering = courseOfferings.find(o => o.id === editingData.courseOfferingId);
    if (!offering) return;

    const oldRegistration = studentRegistrations.find(r => r.id === editingId);
    if (!oldRegistration) return;

    setStudentRegistrations(prev => 
      prev.map(r => 
        r.id === editingId 
          ? { 
              ...r,
              studentName: editingData.studentName.trim(),
              studentEmail: editingData.studentEmail.trim().toLowerCase(),
              studentPhone: editingData.studentPhone.trim(),
              courseOfferingId: editingData.courseOfferingId,
              courseOfferingName: `${offering.courseTypeName} - ${offering.courseName}`
            }
          : r
      )
    );

    // Update course offering counts if changed
    if (oldRegistration.courseOfferingId !== editingData.courseOfferingId) {
      setCourseOfferings(prev =>
        prev.map(o => {
          if (o.id === oldRegistration.courseOfferingId) {
            return { ...o, currentStudents: o.currentStudents - 1 };
          } else if (o.id === editingData.courseOfferingId) {
            return { ...o, currentStudents: o.currentStudents + 1 };
          }
          return o;
        })
      );
    }

    setEditingId(null);
    setEditingData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseOfferingId: ''
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseOfferingId: ''
    });
    setErrors({});
  };

  const handleDelete = (id: string) => {
    const registration = studentRegistrations.find(r => r.id === id);
    if (!registration) return;

    setStudentRegistrations(prev => prev.filter(r => r.id !== id));
    
    // Update course offering student count
    setCourseOfferings(prev =>
      prev.map(o =>
        o.id === registration.courseOfferingId
          ? { ...o, currentStudents: Math.max(0, o.currentStudents - 1) }
          : o
      )
    );
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    setStudentRegistrations(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableOfferings = courseOfferings.filter(o => o.currentStudents < o.maxStudents);
  
  const filteredRegistrations = selectedOfferingFilter 
    ? studentRegistrations.filter(r => r.courseOfferingId === selectedOfferingFilter)
    : studentRegistrations;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-indigo-600 p-3 rounded-full">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Student Registrations</h1>
        </div>
        <p className="text-gray-600">Manage student registrations for course offerings</p>
      </div>

      {/* Add Student Registration Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-indigo-600" />
          Register New Student
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                placeholder="Enter student's full name"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.studentName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.studentName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.studentName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="studentEmail"
                value={formData.studentEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                placeholder="Enter student's email"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.studentEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.studentEmail && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.studentEmail}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="studentPhone"
                value={formData.studentPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, studentPhone: e.target.value }))}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.studentPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.studentPhone && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.studentPhone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="courseOfferingSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course Offering *
              </label>
              <select
                id="courseOfferingSelect"
                value={formData.courseOfferingId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseOfferingId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.courseOfferingId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a course offering...</option>
                {availableOfferings.map(offering => (
                  <option key={offering.id} value={offering.id}>
                    {offering.courseTypeName} - {offering.courseName} 
                    ({offering.maxStudents - offering.currentStudents} spots available)
                  </option>
                ))}
              </select>
              {errors.courseOfferingId && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.courseOfferingId}
                </p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={availableOfferings.length === 0}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Register Student
          </button>
          
          {availableOfferings.length === 0 && (
            <p className="text-sm text-amber-600 text-center">
              No course offerings with available spots. Create course offerings first.
            </p>
          )}
        </form>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <label htmlFor="offeringFilter" className="text-sm font-medium text-gray-700">
            Filter by Course Offering:
          </label>
          <select
            id="offeringFilter"
            value={selectedOfferingFilter}
            onChange={(e) => setSelectedOfferingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">All Registrations</option>
            {courseOfferings.map(offering => (
              <option key={offering.id} value={offering.id}>
                {offering.courseTypeName} - {offering.courseName}
              </option>
            ))}
          </select>
          {selectedOfferingFilter && (
            <button
              onClick={() => setSelectedOfferingFilter('')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Student Registrations List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Student Registrations ({filteredRegistrations.length})
          {selectedOfferingFilter && (
            <span className="text-sm font-normal text-indigo-600">
              {' '}• Filtered by {courseOfferings.find(o => o.id === selectedOfferingFilter)?.courseOfferingName}
            </span>
          )}
        </h2>
        
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">
              {selectedOfferingFilter ? 'No registrations found for this course offering' : 'No student registrations yet'}
            </p>
            <p className="text-gray-400">
              {selectedOfferingFilter ? 'Try changing your filter or register new students' : 'Register your first student using the form above'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 hover:shadow-md transition-shadow"
              >
                {editingId === registration.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingData.studentName}
                        onChange={(e) => setEditingData(prev => ({ ...prev, studentName: e.target.value }))}
                        placeholder="Student name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="email"
                        value={editingData.studentEmail}
                        onChange={(e) => setEditingData(prev => ({ ...prev, studentEmail: e.target.value }))}
                        placeholder="Email address"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        value={editingData.studentPhone}
                        onChange={(e) => setEditingData(prev => ({ ...prev, studentPhone: e.target.value }))}
                        placeholder="Phone number"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={editingData.courseOfferingId}
                        onChange={(e) => setEditingData(prev => ({ ...prev, courseOfferingId: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {courseOfferings.map(offering => (
                          <option key={offering.id} value={offering.id}>
                            {offering.courseTypeName} - {offering.courseName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className="text-sm text-red-600 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <p key={index} className="flex items-center">
                            <X className="h-4 w-4 mr-1" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{registration.studentName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                          {registration.studentEmail}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                          {registration.studentPhone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                          Registered: {formatDate(registration.registrationDate)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-indigo-600" />
                          {registration.courseOfferingName}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <select
                          value={registration.status}
                          onChange={(e) => handleStatusChange(registration.id, e.target.value as any)}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(registration.status)} border-0 focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(registration)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        title="Edit registration"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(registration.id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        title="Delete registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationManager;