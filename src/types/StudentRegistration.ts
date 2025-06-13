export interface StudentRegistration {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseOfferingId: string;
  courseOfferingName: string;
  registrationDate: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export interface StudentRegistrationFormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseOfferingId: string;
}