import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Check, X } from 'lucide-react';
import { CourseType, CourseTypeFormData } from '../types/CourseType';

interface CourseTypeManagerProps {
  courseTypes: CourseType[];
  setCourseTypes: React.Dispatch<React.SetStateAction<CourseType[]>>;
}

const CourseTypeManager: React.FC<CourseTypeManagerProps> = ({ courseTypes, setCourseTypes }) => {
  const [formData, setFormData] = useState<CourseTypeFormData>({ name: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (name: string): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Course type name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Course type name must be at least 2 characters';
    } else if (courseTypes.some(ct => ct.name.toLowerCase() === name.trim().toLowerCase() && ct.id !== editingId)) {
      newErrors.name = 'Course type name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData.name)) {
      return;
    }

    const newCourseType: CourseType = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourseTypes(prev => [newCourseType, ...prev]);
    setFormData({ name: '' });
    setErrors({});
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (!validateForm(editingName)) {
      return;
    }

    setCourseTypes(prev => 
      prev.map(ct => 
        ct.id === editingId 
          ? { ...ct, name: editingName.trim(), updatedAt: new Date() }
          : ct
      )
    );
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setCourseTypes(prev => prev.filter(ct => ct.id !== id));
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
          <div className="bg-blue-600 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Course Type Management</h1>
        </div>
        <p className="text-gray-600">Define and manage different types of course delivery methods</p>
      </div>

      {/* Add Course Type Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-blue-600" />
          Add New Course Type
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseTypeName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Type Name
            </label>
            <input
              type="text"
              id="courseTypeName"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter course type name (e.g., Individual, Group, Special)"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Course Type
          </button>
        </form>
      </div>

      {/* Course Types List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Course Types ({courseTypes.length})
        </h2>
        
        {courseTypes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No course types yet</p>
            <p className="text-gray-400">Add your first course type using the form above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courseTypes.map((courseType) => (
              <div
                key={courseType.id}
                className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingId === courseType.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={`text-xl font-semibold bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          autoFocus
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
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{courseType.name}</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Created: {formatDate(courseType.createdAt)}</p>
                          {courseType.updatedAt.getTime() !== courseType.createdAt.getTime() && (
                            <p>Updated: {formatDate(courseType.updatedAt)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {editingId === courseType.id ? (
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
                          onClick={() => handleEdit(courseType.id, courseType.name)}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          title="Edit course type"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(courseType.id)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          title="Delete course type"
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

export default CourseTypeManager;