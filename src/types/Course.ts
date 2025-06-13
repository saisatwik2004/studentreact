export interface Course {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseFormData {
  name: string;
  description?: string;
}