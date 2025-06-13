export interface CourseType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseTypeFormData {
  name: string;
}