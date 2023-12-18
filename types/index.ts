export interface User {
  _id: string; // user ObjectId()
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

export interface Course {
    _id: string; // course ObjectId()
    creator: string; // user ObjectId()
    title: string;
    description: string;
    coursePicture: string; // begins with "data:image/"
	tags: string[];
    created: Date,
	lessons: string[], // array of lesson ObjectIds()
}

export interface Lesson {
    _id: string; // lesson ObjectId()
    courseId: string; // course ObjectId()
    title: string;
    description: string;
    content: string;
    videos: string[]; // strings begin with "https://www.youtube.com/embed/"
    created: Date;
    viewed: string[]; // array of user ObjectIds()
    quiz: Quiz;
    discussion: Message[]
}

export interface Quiz {
    description: string;
    questions: Question[];
    completed: string[] 
}

export interface Question {
    question: string
    answers: string[],
    correctAnswer: number,
}

export interface Message {
    username: string,
    message: string,
    created: Date,
}