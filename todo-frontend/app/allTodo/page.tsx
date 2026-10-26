/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { TodoCard } from '@/components/features/todo/TodoCard';
import { apiClient } from '@/lib/axios-client';
import { useTodoStore } from '@/store/todoStore';
import { useAuthStore } from '@/store/userAuthStore';
import { Todo } from '@/type';
import { toast } from 'sonner';
import { TodoService } from '@/services/todoService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateTodoModal } from '@/components/features/todo/CreateTodoModal';
import UpdateTodo from '@/components/features/todo/UpdateTodo';


const AllTodos = () => {
  const { todos, setTodos, deleteTodo,setTodoCteateBoxOpen,setUpdateTodo,setUpdateOpen } = useTodoStore();
  const { token } = useAuthStore();

  async function getTodosData() {
    try {
      // The interceptor automatically handles the Bearer token!
      const data = await apiClient.get<any, Todo[]>('/api/todos',{
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTodos(data); 
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    }
  }



  useEffect(() => {
    getTodosData();
  }, [token, setTodos]);

  const handleDelete=(id:number)=>{

   // setTodos(todos.filter(todo => todo.id !== id));
   TodoService.deleteTodo(token,id);
   deleteTodo(id);
   toast.success('Task deleted successfully');
   getTodosData();
  }

  const handleEdit=(todo:Todo)=>{
    setUpdateTodo(todo);
    setUpdateOpen();
  }

    const handleTodoToggle= async(id:number,currentStatus:boolean)=>{
        try{
            const res= await apiClient.post<any,Todo>(`/api/todos/isDone/${id}`,currentStatus,
                { headers:{
                     'Authorization': `Bearer ${token}`
                 }})
                 getTodosData();
            toast.success('Task status updated successfully');
        }catch(error){
            toast.error('something went wrong');
        } 
  }


  const safeTodos = Array.isArray(todos) ? todos : [];
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
    {/* Top Header with Create Todo Button */}
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Tasks</h1>
      <Button onClick={() => setTodoCteateBoxOpen()} className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
        <Plus className="h-4 w-4" />
        Create Todo
      </Button>
    </div>

    {/* Todo List Grid */}
    <div className="grid gap-4 md:grid-cols-2">
      {safeTodos.length > 0 ? (
        safeTodos.map((todo: Todo) => <TodoCard key={todo.todoId} todo={todo} onDelete={handleDelete} onToggleComplete={handleTodoToggle} onEdit={handleEdit}/>)
      ) : (
        <p className="col-span-2 text-sm text-slate-500 text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          No tasks found. Create one above!
        </p>
      )}
    </div>

    {/* Popup Create Modal Component */}
    <CreateTodoModal />
    <UpdateTodo/>
  </div>
  );
};

export default AllTodos;