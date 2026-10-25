'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Todo } from '@/type';



interface TodoCardProps {
  todo: Todo;
  onToggleComplete?: (id: number, currentStatus: boolean) => void;
  onEdit?: (todo: Todo) => void;
  onDelete?: (id: number) => void;
}

export function TodoCard({ todo, onToggleComplete, onEdit, onDelete }: TodoCardProps) {
  // Check if due date is earlier than today (overdue check)
  const isOverdue = React.useMemo(() => {
    if (!todo.doDate || todo.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.doDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }, [todo.doDate, todo.done]);

  // Format date display nicely
  const formattedDate = React.useMemo(() => {
    if (!todo.doDate) return '';
    const date = new Date(todo.doDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [todo.doDate]);

 

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300 border shadow-sm rounded-xl',
          // Base light paper background style
          'bg-amber-50/30 border-amber-200/60 hover:shadow-md',
          // Overdue highlight effect
          isOverdue && 'bg-red-50/40 border-red-300 ring-2 ring-red-400/20 shadow-red-100',
          // Completed state styling
          todo.done && 'bg-slate-100/60 border-slate-200/80 opacity-75'
        )}
      >
        <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
          {/* Header Section: Title & Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1">
              <h3
                className={cn(
                  'font-script text-2xl font-bold tracking-wide leading-tight text-slate-800 transition-all',
                  todo.done && 'line-through decoration-slate-500 decoration-2 text-slate-400'
                )}
              >
                {todo.title}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Complete Toggle Button */}
              <Button
                size="icon"
                variant={todo.done ? 'default' : 'outline'}
                onClick={() => onToggleComplete?.(todo.todoId, todo.done)}
                className={cn(
                  'h-8 w-8 rounded-lg transition-all',
                  todo.done
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                )}
                title={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <Check className="h-4 w-4" />
              </Button>

              {/* Edit Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit?.(todo)}
                className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                title="Edit task"
              >
                <Edit3 className="h-4 w-4" />
              </Button>

              {/* Delete Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete?.(todo.todoId)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body Section: Content with Script Font */}
          <p
            className={cn(
              'font-script text-xl leading-snug text-slate-700 whitespace-pre-wrap transition-all',
              todo.done && 'line-through decoration-slate-400 decoration-1 text-slate-400'
            )}
          >
            {todo.content}
          </p>

          {/* Footer Section: Due Date & Overdue Indicator */}
          {todo.doDate && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-xs font-medium">
              <div
                className={cn(
                  'flex items-center gap-1.5 text-slate-500',
                  isOverdue && 'text-red-600 font-semibold'
                )}
              >
                {isOverdue ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span>Due: {formattedDate}</span>
              </div>

              {isOverdue && (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">
                  Overdue
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}