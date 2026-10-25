/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoService } from "@/services/todoService";
import type { Todo } from "@/type";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface TodoStatus{
    todos:Todo[];
    todoCreateBoxOpen:boolean;
    updateTodo:Todo|null;
    isUpdateTodoOpen:boolean;
    setTodos:(todos: Todo[] | any) => void;
    deleteTodo:(id:number)=>void;
    setTodoCteateBoxOpen:()=>void;
    setTodoCteateBoxClose:()=>void;
    addTodo:(todo:Todo)=>void;
    setUpdateOpen:()=>void;
    setUpdateClose:()=>void;
    setUpdateTodo:(todo:Todo)=>void;
    updateTodoInStore:(upTodo:Todo)=>void;

}

export const useTodoStore = create<TodoStatus>()((set) => ({
    todos: [],
    todoCreateBoxOpen:false,
    isUpdateTodoOpen:false,
    updateTodo:null,
    setTodos: (todos) => set({ todos: Array.isArray(todos) ? todos : [] }),
    deleteTodo:(id)=>set((state)=>({todos:state.todos.filter((t)=>t.todoId !==id)})),
    setTodoCteateBoxOpen:()=>set({todoCreateBoxOpen:true}),
    setTodoCteateBoxClose:()=>set({todoCreateBoxOpen:false}),
    addTodo:(todo)=>set((state)=>({todos:[todo,...state.todos]})),
    setUpdateOpen:()=>set({isUpdateTodoOpen:true}),
    setUpdateClose:()=>set({isUpdateTodoOpen:false}),
    setUpdateTodo:(todo:Todo)=>set(({updateTodo:todo})),
    updateTodoInStore:(upTodo)=>set((state)=>({todos:state.todos.map((t)=>(t.todoId===upTodo.todoId)?upTodo:t)}))
}));


