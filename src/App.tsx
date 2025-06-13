import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CourseTypeManager from './components/CourseTypeManager';
import CourseManager from './components/CourseManager';
import CourseOfferingManager from './components/CourseOfferingManager';
import StudentRegistrationManager from './components/StudentRegistrationManager';
import { CourseType } from './types/CourseType';
import { Course } from './types/Course';
import { CourseOffering } from './types/CourseOffering';
import { StudentRegistration } from './types/StudentRegistration';

function App() {
  const [activeTab, setActiveTab] = useState('courseTypes');
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const initialCourseTypes: CourseType[] = [
      {
        id: crypto.randomUUID(),
        name: 'Individual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Group',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Special',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const initialCourses: Course[] = [
      {
        id: crypto.randomUUID(),
        name: 'English Language',
        description: 'Comprehensive English language course covering grammar, vocabulary, and communication skills',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Mathematics',
        description: 'Advanced mathematics course covering algebra, geometry, and calculus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Hindi Literature',
        description: 'Study of classical and modern Hindi literature and poetry',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setCourseTypes(initialCourseTypes);
    setCourses(initialCourses);

    // Create some initial course offerings
    const offering1: CourseOffering = {
      id: crypto.randomUUID(),
      courseId: initialCourses[0].id,
      courseTypeId: initialCourseTypes[0].id,
      courseName: initialCourses[0].name,
      courseTypeName: initialCourseTypes[0].name,
      maxStudents: 25,
      currentStudents: 8,
      startDate: new Date(2025, 1, 15),
      endDate: new Date(2025, 5, 15),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const offering2: CourseOffering = {
      id: crypto.randomUUID(),
      courseId: initialCourses[1].id,
      courseTypeId: initialCourseTypes[1].id,
      courseName: initialCourses[1].name,
      courseTypeName: initialCourseTypes[1].name,
      maxStudents: 20,
      currentStudents: 12,
      startDate: new Date(2025, 2, 1),
      endDate: new Date(2025, 6, 1),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourseOfferings([offering1, offering2]);

    // Create some initial student registrations
    const registration1: StudentRegistration = {
      id: crypto.randomUUID(),
      studentName: 'John Smith',
      studentEmail: 'john.smith@email.com',
      studentPhone: '+1-555-0123',
      courseOfferingId: offering1.id,
      courseOfferingName: `${offering1.courseTypeName} - ${offering1.courseName}`,
      registrationDate: new Date(),
      status: 'active'
    };

    const registration2: StudentRegistration = {
      id: crypto.randomUUID(),
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      studentPhone: '+1-555-0456',
      courseOfferingId: offering2.id,
      courseOfferingName: `${offering2.courseTypeName} - ${offering2.courseName}`,
      registrationDate: new Date(),
      status: 'active'
    };

    setStudentRegistrations([registration1, registration2]);
  }, []);

  const stats = {
    courseTypes: courseTypes.length,
    courses: courses.length,
    offerings: courseOfferings.length,
    registrations: studentRegistrations.length
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'courseTypes':
        return (
          <CourseTypeManager 
            courseTypes={courseTypes}
            setCourseTypes={setCourseTypes}
          />
        );
      case 'courses':
        return (
          <CourseManager 
            courses={courses}
            setCourses={setCourses}
          />
        );
      case 'offerings':
        return (
          <CourseOfferingManager 
            courseOfferings={courseOfferings}
            setCourseOfferings={setCourseOfferings}
            courses={courses}
            courseTypes={courseTypes}
          />
        );
      case 'registrations':
        return (
          <StudentRegistrationManager 
            studentRegistrations={studentRegistrations}
            setStudentRegistrations={setStudentRegistrations}
            courseOfferings={courseOfferings}
            setCourseOfferings={setCourseOfferings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          stats={stats}
        />
        
        <div className="space-y-8">
          {renderActiveComponent()}
        </div>

        {/* Footer with Statistics */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">System Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.courseTypes}</div>
              <div className="text-blue-100">Course Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.courses}</div>
              <div className="text-blue-100">Available Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.offerings}</div>
              <div className="text-blue-100">Active Offerings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.registrations}</div>
              <div className="text-blue-100">Registered Students</div>
            </div>
          </div>
          <div className="mt-6 text-center text-blue-100">
            <p>Complete student registration management system</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;