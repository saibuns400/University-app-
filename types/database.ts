export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  address: string | null;
  high_school: string | null;
  graduation_year: number | null;
  gpa: number | null;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  short_name: string | null;
  country: string;
  city: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  university_id: string;
  name: string;
  degree_type: string; // Bachelor, Master, PhD, Diploma
  duration_years: number | null;
  description: string | null;
  requirements: string | null;
  application_deadline: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  university_id: string;
  program_id: string;
  status: ApplicationStatus;
  personal_statement: string | null;
  additional_info: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  student_id: string;
  application_id: string | null; // null = general document
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_type: string; // transcript, id, certificate, essay, other
  created_at: string;
}