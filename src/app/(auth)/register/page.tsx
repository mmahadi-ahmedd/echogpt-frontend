'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { registerSchema, RegisterFormValues } from '@/lib/validation/auth.schema';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      await registerUser(values);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message ?? 'Registration failed'
          : 'Registration failed';
      setServerError(Array.isArray(message) ? message[0] : message);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full"
            {...register('email')}
          />
          {errors.email && (
            <span className="mt-1 text-sm text-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            className="input input-bordered w-full"
            {...register('password')}
          />
          {errors.password && (
            <span className="mt-1 text-sm text-error">{errors.password.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="confirmPassword">
            <span className="label-text">Confirm password</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input input-bordered w-full"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="mt-1 text-sm text-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{serverError}</div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? <span className="loading loading-spinner" /> : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="link link-primary">
          Log in
        </Link>
      </p>
    </>
  );
}