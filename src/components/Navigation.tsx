import React from 'react';
import { BookOpen, Calendar, UserPlus, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    courseTypes: number;
    courses: number;
    offerings: number;
    registrations: number;
  };
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, stats }) => {
  const tabs = [
    {
      id: 'courseTypes',
      name: 'Course Types',
      icon: BookOpen,
      count: stats.courseTypes,
      color: 'blue'
    },
    {
      id: 'courses',
      name: 'Courses',
      icon: BookOpen,
      count: stats.courses,
      color: 'green'
    },
    {
      id: 'offerings',
      name: 'Course Offerings',
      icon: Calendar,
      count: stats.offerings,
      color: 'purple'
    },
    {
      id: 'registrations',
      name: 'Student Registrations',
      icon: UserPlus,
      count: stats.registrations,
      color: 'indigo'
    }
  ];

  const getTabColors = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: isActive 
        ? 'bg-green-600 text-white border-green-600' 
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: isActive 
        ? 'bg-purple-600 text-white border-purple-600' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      indigo: isActive 
        ? 'bg-indigo-600 text-white border-indigo-600' 
        : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Student Registration System
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${getTabColors(tab.color, isActive)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-6 w-6" />
                <span className={`text-2xl font-bold ${isActive ? 'text-white' : `text-${tab.color}-600`}`}>
                  {tab.count}
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{tab.name}</h3>
                <p className={`text-sm ${isActive ? 'text-white/80' : `text-${tab.color}-600/70`}`}>
                  Manage {tab.name.toLowerCase()}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;