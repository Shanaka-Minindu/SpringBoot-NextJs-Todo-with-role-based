/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/axios-client"
import { useAuthStore } from "@/store/userAuthStore"
import { Todo } from "@/type"
import { error } from "console"
import { toast } from "sonner"


export const TodoService={

    

    async fetchTodos(token:string):Promise<Todo[]>{
        let todos:Todo[] = [];
        try{
            todos = await apiClient.get<any,Todo[]>('/api/todo',{
                headers: {
                              Authorization: `Bearer ${token}`,
                            },
            });
        }catch(error){
            console.log('Fetched Todos from API Catch:'); // Debugging log
            toast.error( 'Failed to load tasks');
        }
        return todos;
    },

    async deleteTodo(token:string,todoId:number):Promise<void>{

        try{

            await apiClient.delete(`/api/todos/${todoId}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
        }catch(error){
            console.log(error);
        }
    }
}