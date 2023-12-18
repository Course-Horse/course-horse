export interface User {
  username: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  created: Date;
  admin: boolean;
  enrolledCourses: string[];
  application: Application;
}

export interface Application {
  status: string;
  created: Date;
  content: string;
  documents: string[];
}
