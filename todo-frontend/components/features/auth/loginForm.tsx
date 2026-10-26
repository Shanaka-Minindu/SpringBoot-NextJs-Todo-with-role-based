/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/axios-client';
import { loginSchema, LoginValues } from '@/features/todos/schemas/user.login.schema';
import { useAuthStore } from '@/store/userAuthStore';
import { LoginResponse } from '@/type';
import { useTodoStore } from '@/store/todoStore';
import { redirect } from 'next/navigation';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const{setAuth} = useAuthStore();
  const{setTodos} = useTodoStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      // Connect to your Spring Boot Backend endpoint (e.g., POST /auth/login)
      const response:LoginResponse = await apiClient.post('/login', data);
      

      setAuth(response.token,response.refreshToken,response.role);
      setTodos(response.token);
      toast.success('Successfully logged in!');
      localStorage.setItem('token', response.token);
      console.log(response.token);
      // Handle session tokens or redirection here
    } catch (error: any) {
      toast.error(error.message || 'Invalid username or password');
    }
    redirect('/allTodo');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4">
      {/* Animated Entrance Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-100 rounded-2xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
            >
              <Lock className="h-6 w-6 text-slate-800" />
            </motion.div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Enter your credentials to access your task dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 focus-visible:bg-white transition-all text-slate-800 rounded-lg"
                    {...register('userName')}
                  />
                </div>
                {errors.userName && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-500 font-medium"
                  >
                    {errors.userName.message}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 focus-visible:bg-white transition-all text-slate-800 rounded-lg"
                    {...register('password')}
                  />
                  {/* Show / Hide Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-500 font-medium"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Animated Submit Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
              {/* Footer Link to Login */}
              <div className="text-center pt-2 text-sm text-slate-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-slate-800 font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      
    </div>
  );
}