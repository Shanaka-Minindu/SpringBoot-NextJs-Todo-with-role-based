export interface LoginResponse {
  token: string;
  role: 'Admin' | 'User';
  message: string;
  userName: string;
}

export interface Todo {
  todoId: number;
  title: string;
  content: string;
  doDate: string;
  done: boolean;
}