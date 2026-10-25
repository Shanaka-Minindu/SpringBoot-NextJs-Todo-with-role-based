/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useTodoStore } from '@/store/todoStore';
import { useAuthStore } from '@/store/userAuthStore';
import { apiClient } from '@/lib/axios-client';
import { createTodoSchema, CreateTodoValues } from '@/features/todos/schemas/createTodoSchema';
import { Todo } from '@/type';

const UpdateTodo = () => {
  const { updateTodo, setUpdateClose, updateTodoInStore,isUpdateTodoOpen} = useTodoStore();
  const { token } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoValues>({
    resolver: zodResolver(createTodoSchema),
  });

  const selectedDate = watch('doDate');

  // Pre-fill form values whenever updateTodo changes
  useEffect(() => {
    if (updateTodo) {
      reset({
        title: updateTodo.title,
        content: updateTodo.content,
        doDate: updateTodo.doDate ? parseISO(updateTodo.doDate) : new Date(),
      });
    }
  }, [updateTodo, reset]);

  const onSubmit = async (data: CreateTodoValues) => {
    if (!updateTodo) return;

    try {
      const payload = {
        title: data.title,
        content: data.content,
        doDate: format(data.doDate, 'yyyy-MM-dd'),
      };

      // Calls your backend @PostMapping("/{todoId}") endpoint
      const updatedResponse = await apiClient.put<any, Todo>(`/api/todos/${updateTodo.todoId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      updateTodoInStore(updatedResponse);
      toast.success('Task updated successfully!');
      setUpdateClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  return (
    <Dialog open={isUpdateTodoOpen} onOpenChange={() => setUpdateClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Update Task</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Modify the details of your task below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title Field */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Title
            </Label>
            <Input id="title" placeholder="Enter task title..." {...register('title')} className="h-10" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Content Field */}
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-sm font-medium text-slate-700">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Describe your task..."
              {...register('content')}
              className="resize-none min-h-[90px]"
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          </div>

          {/* Date Picker with Past Days Disabled */}
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-slate-700">Due Date</Label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900',
                  !selectedDate && 'text-slate-400'
                )}
              >
                <div className="flex items-center w-full cursor-pointer">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a due date'}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-white shadow-md border rounded-lg" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setValue('doDate', date, { shouldValidate: true });
                    }
                  }}
                  // Disable all days before today
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.doDate && <p className="text-xs text-red-500">{errors.doDate.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUpdateClose()}
              className="border-slate-200 text-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTodo;