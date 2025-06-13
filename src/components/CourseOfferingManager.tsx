import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, Check, X, Filter } from 'lucide-react';
import { CourseOffering, CourseOfferingFormData } from '../types/CourseOffering';
import { Course } from '../types/Course';
import { CourseType } from '../types/CourseType';

interface CourseOfferingManagerProps {
  courseOfferings: CourseOffering[];
  setCourseOfferings: React.Dispatch<React.SetStateAction<CourseOffering[]>>;
  courses: Course[];
  courseTypes: CourseType[];
}

const CourseOfferingManager: React.FC<CourseOfferingManagerProps> = ({
  courseOfferings,
  setCourseOfferings,
  courses,
  courseTypes
}) => {
  const [formData, setFormData] = useState<CourseOfferingFormData>({
    courseId: '',
    courseTypeId: '',
    maxStudents: 20,
    startDate: '',
    endDate: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<CourseOfferingFormData>({
    courseId: '',
    courseTypeId: '',
    maxStudents: 20,
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [filterCourseType, setFilterCourseType] = useState<string>('');

  const validateForm = (data: CourseOfferingFormData): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    if (!data.courseTypeId) {
      newErrors.courseTypeId = 'Please select a course type';
    }
    
    if (data.maxStudents < 1) {
      newErrors.maxStudents = 'Maximum students must be at least 1';
    } else if (data.maxStudents > 100) {
      newErrors.maxStudents = 'Maximum students cannot exceed 100';
    }
    
    if (!data.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!data.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    const course = courses.find(c => c.id === formData.courseId);
    const courseType = courseTypes.find(ct => ct.id === formData.courseTypeId);
    
    if (!course || !courseType) return;

    const newOffering: CourseOffering = {
      id: crypto.randomUUID(),
      courseId: formData.courseId,
      courseTypeId: formData.courseTypeId,
      courseName: course.name,
      courseTypeName: courseType.name,
      maxStudents: formData.maxStudents,
      currentStudents: 0,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourseOfferings(prev => [newOffering, ...prev]);
    setFormData({
      courseId: '',
      courseTypeId: '',
      maxStudents: 20,
      startDate: '',
      endDate: ''
    });
    setErrors({});
  };

  const handleEdit = (offering: CourseOffering) => {
    setEditingId(offering.id);
    setEditingData({
      courseId: offering.courseId,
      courseTypeId: offering.courseTypeId,
      maxStudents: offering.maxStudents,
      startDate: offering.startDate.toISOString().split('T')[0],
      endDate: offering.endDate.toISOString().split('T')[0]
    });
  };

  const handleSaveEdit = () => {
    if (!validateForm(editingData)) {
      return;
    }

    const course = courses.find(c => c.id === editingData.courseId);
    const courseType = courseTypes.find(ct => ct.id === editingData.courseTypeId);
    
    if (!course || !courseType) return;

    setCourseOfferings(prev => 
      prev.map(o => 
        o.id === editingId 
          ? { 
              ...o,
              courseId: editingData.courseId,
              courseTypeId: editingData.courseTypeId,
              courseName: course.name,
              courseTypeName: courseType.name,
              maxStudents: editingData.maxStudents,
              startDate: new Date(editingData.startDate),
              endDate: new Date(editingData.endDate),
              updatedAt: new Date()
            }
          : o
      )
    );
    setEditingId(null);
    setEditingData({
      courseId: '',
      courseTypeId: '',
      maxStudents: 20,
      startDate: '',
      endDate: ''
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({
      courseId: '',
      courseTypeId: '',
      maxStudents: 20,
      startDate: '',
      endDate: ''
    });
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setCourseOfferings(prev => prev.filter(o => o.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredOfferings = filterCourseType 
    ? courseOfferings.filter(o => o.courseTypeId === filterCourseType)
    : courseOfferings;

  const availableSpots = (offering: CourseOffering) => offering.maxStudents - offering.currentStudents;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-purple-600 p-3 rounded-full">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Course Offerings</h1>
        </div>
        <p className="text-gray-600">Create and manage course offerings by combining courses with course types</p>
      </div>

      {/* Add Course Offering Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-purple-600" />
          Create New Course Offering
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course *
              </label>
              <select
                id="courseSelect"
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.courseId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              {errors.courseId && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.courseId}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="courseTypeSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course Type *
              </label>
              <select
                id="courseTypeSelect"
                value={formData.courseTypeId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseTypeId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.courseTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a course type...</option>
                {courseTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.courseTypeId && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.courseTypeId}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students *
              </label>
              <input
                type="number"
                id="maxStudents"
                min="1"
                max="100"
                value={formData.maxStudents}
                onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.maxStudents ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.maxStudents && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.maxStudents}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={courses.length === 0 || courseTypes.length === 0}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course Offering
          </button>
          
          {(courses.length === 0 || courseTypes.length === 0) && (
            <p className="text-sm text-amber-600 text-center">
              You need to have at least one course and one course type to create offerings
            </p>
          )}
        </form>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-purple-600" />
          <label htmlFor="filterSelect" className="text-sm font-medium text-gray-700">
            Filter by Course Type:
          </label>
          <select
            id="filterSelect"
            value={filterCourseType}
            onChange={(e) => setFilterCourseType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            <option value="">All Course Types</option>
            {courseTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {filterCourseType && (
            <button
              onClick={() => setFilterCourseType('')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Course Offerings List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Course Offerings ({filteredOfferings.length})
          {filterCourseType && (
            <span className="text-sm font-normal text-purple-600">
              {' '}• Filtered by {courseTypes.find(ct => ct.id === filterCourseType)?.name}
            </span>
          )}
        </h2>
        
        {filteredOfferings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">
              {filterCourseType ? 'No offerings found for this filter' : 'No course offerings yet'}
            </p>
            <p className="text-gray-400">
              {filterCourseType ? 'Try changing your filter or create new offerings' : 'Create your first course offering using the form above'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredOfferings.map((offering) => (
              <div
                key={offering.id}
                className="bg-purple-50 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-shadow"
              >
                {editingId === offering.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editingData.courseId}
                        onChange={(e) => setEditingData(prev => ({ ...prev, courseId: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                      </select>
                      <select
                        value={editingData.courseTypeId}
                        onChange={(e) => setEditingData(prev => ({ ...prev, courseTypeId: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {courseTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editingData.maxStudents}
                        onChange={(e) => setEditingData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="date"
                        value={editingData.startDate}
                        onChange={(e) => setEditingData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="date"
                        value={editingData.endDate}
                        onChange={(e) => setEditingData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className="text-sm text-red-600">
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
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {offering.courseTypeName} - {offering.courseName}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                            {formatDate(offering.startDate)} - {formatDate(offering.endDate)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-purple-600" />
                            {offering.currentStudents}/{offering.maxStudents} students
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              availableSpots(offering) > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {availableSpots(offering) > 0 
                                ? `${availableSpots(offering)} spots available` 
                                : 'Full'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(offering)}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          title="Edit offering"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(offering.id)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          title="Delete offering"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOfferingManager;