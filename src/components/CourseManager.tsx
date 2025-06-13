import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Check, X, FileText } from 'lucide-react';
import { Course, CourseFormData } from '../types/Course';

interface CourseManagerProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseManager: React.FC<CourseManagerProps> = ({ courses, setCourses }) => {
  const [formData, setFormData] = useState<CourseFormData>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<CourseFormData>({ name: '', description: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (data: CourseFormData, editId?: string): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Course name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Course name must be at least 2 characters';
    } else if (courses.some(c => c.name.toLowerCase() === data.name.trim().toLowerCase() && c.id !== editId)) {
      newErrors.name = 'Course name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourses(prev => [newCourse, ...prev]);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setEditingData({ 
      name: course.name, 
      description: course.description || '' 
    });
  };

  const handleSaveEdit = () => {
    if (!validateForm(editingData, editingId!)) {
      return;
    }

    setCourses(prev => 
      prev.map(c => 
        c.id === editingId 
          ? { 
              ...c, 
              name: editingData.name.trim(), 
              description: editingData.description?.trim() || '',
              updatedAt: new Date() 
            }
          : c
      )
    );
    setEditingId(null);
    setEditingData({ name: '', description: '' });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: '', description: '' });
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-green-600 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
        </div>
        <p className="text-gray-600">Create and manage courses for your institution</p>
      </div>

      {/* Add Course Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-green-600" />
          Add New Course
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter course name (e.g., English, Mathematics, Science)"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="courseDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter course description (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Course
          </button>
        </form>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Courses ({courses.length})
        </h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No courses yet</p>
            <p className="text-gray-400">Add your first course using the form above</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-green-50 rounded-xl p-6 border border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editingId === course.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingData.name}
                          onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                          className={`text-xl font-semibold bg-white border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          autoFocus
                        />
                        <textarea
                          value={editingData.description}
                          onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Course description"
                          rows={2}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600 flex items-center">
                            <X className="h-4 w-4 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                        {course.description && (
                          <p className="text-gray-600 mb-3 flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                            {course.description}
                          </p>
                        )}
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Created: {formatDate(course.createdAt)}</p>
                          {course.updatedAt.getTime() !== course.createdAt.getTime() && (
                            <p>Updated: {formatDate(course.updatedAt)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {editingId === course.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          title="Save changes"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          title="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          title="Edit course"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;