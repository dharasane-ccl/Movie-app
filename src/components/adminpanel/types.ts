export interface Movie {
    _id: string;
    title: string;
    description: string;
    genre: string;
    image: string;
    isFavorite: boolean;
    year: number;
    targetUrl: string; 
   
}

export interface User {
    employee_code: any;
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface MovieFormErrors {
    user? : User; 
    title?: string;
    description?: string;
    genre?: string;
    year?: string;
    image?: string;
    targetUrl?: string
}