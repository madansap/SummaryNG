'use client';

import Link from 'next/link';

export default function VerifyEmail() {
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent you a verification link. Please check your email to verify your account.
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already verified?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 