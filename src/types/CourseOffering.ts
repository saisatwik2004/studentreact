export interface CourseOffering {
  id: string;
  courseId: string;
  courseTypeId: string;
  courseName: string;
  courseTypeName: string;
  maxStudents: number;
  currentStudents: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseOfferingFormData {
  courseId: string;
  courseTypeId: string;
  maxStudents: number;
  startDate: string;
  endDate: string;
}