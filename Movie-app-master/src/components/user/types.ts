export interface User {
  id: any;
  username: any;
  _id: string;
  first_name: string;
  last_name: string;
  employee_code: string;
  attendance_id: number;
  user_id: string;
  deleted_at: null | string;
  email: string;
  password: string;
  type: number;
}

export interface Movie {
  userId?: number;
  _id: string;
  id?:number
  title: string;
  genre: string;
  isFavorite: boolean;
  description: string;
  year: number;
  image: string;
  targetUrl: string;
  poster?: string; 
  posterPreview?: string; 
  videoLink?: string;
  body?:string
   
}

interface MovieFormErrors {
    title?: string;
    description?: string;
    genre?: string;
    year?: string;
    image?: string;
    targetUrl?: string;
}



