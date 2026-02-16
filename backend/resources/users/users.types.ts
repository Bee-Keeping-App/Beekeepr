// base user type is "safe" to expose publicly
export interface User {
    id: string,
    email: string
};

// UserWithAuth is sensitive, can be coerced into User type before response to ensure integrity
export type UserWithAuth = User | { 
    password: string, 
    refresh: string, 
    access: string 
};