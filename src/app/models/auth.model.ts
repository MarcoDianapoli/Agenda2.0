export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export const STATIC_USER: User = {
  email: 'admin@agenda.com',
  name: 'Administrador',
  isLoggedIn: false
};

export const STATIC_PASSWORD = '123456';
