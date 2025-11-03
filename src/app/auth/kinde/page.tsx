"use client";

import { useRouter } from 'next/navigation';

export default function KindeAuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Sign in with Kinde</h2>
  <p className="text-sm text-gray-600 mb-6">Use your organization or third-party account to sign in. We will redirect you to Kinde to authenticate.</p>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              // Use full-page navigation to trigger the API redirect which then forwards to Kinde
              window.location.href = '/api/auth/kinde/login';
            }}
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Continue with Kinde
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth')}
            className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md"
          >
            Back to email / password
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">By continuing you agree to our terms of service.</p>
      </div>
    </div>
  );
}
