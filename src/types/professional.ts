export interface ProfessionalProfile {
  id: string;
  email: string;
  name: string;
  professionalType: 'CA' | 'CS';
  experience: string;
  specializations: string[];
  createdAt: string;
  updatedAt: string;
}
