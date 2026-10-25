/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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

export function CreateTodoModal() {
  const { todoCreateBoxOpen, setTodoCteateBoxClose, addTodo } = useTodoStore();
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

  const onSubmit = async (data: CreateTodoValues) => {
    try {
      // Format date as 'yyyy-MM-dd' for Spring Boot LocalDate compatibility
      const payload = {
        title: data.title,
        content: data.content,
        doDate: format(data.doDate, 'yyyy-MM-dd'),
      };

      // Explicitly type the expected return type as Todo
      const newTodo = await apiClient.post<any, Todo>('/api/todos', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Pass the strongly typed todo object directly to Zustand
      addTodo(newTodo);
      toast.success('Task created successfully!');
      reset();
      setTodoCteateBoxClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    }
  };

  return (
    <Dialog open={todoCreateBoxOpen} onOpenChange={(open) => !open && setTodoCteateBoxClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Create New Task</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Fill in the details below to add a new task to your schedule.
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
              {/* Removed asChild and replaced with a styled div or direct trigger usage */}
              <PopoverTrigger className={cn(
                'flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
                !selectedDate && 'text-slate-400'
              )}>
                <div className="flex items-center w-full cursor-pointer">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
                  <span className="truncate">{selectedDate ? format(selectedDate, 'PPP') : 'Pick a due date'}</span>
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
              onClick={() => setTodoCteateBoxClose()}
              className="border-slate-200 text-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}