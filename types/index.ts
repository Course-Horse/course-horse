import { ObjectId } from "mongodb";

export interface User {
  _id: string;
  username: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
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

export interface UserUpdate {
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}
