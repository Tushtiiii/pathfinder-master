"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import type { SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
	const [mode, setMode] = useState<'login' | 'signup'>('signup');
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);
		setLoading(true);

		try {
			if (mode === 'signup') {
				const res = await fetch('/api/auth/signup', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, name, password }),
				});
				const data = await res.json();
				if (!res.ok) {
					setMessage(data?.error || 'Signup failed');
				} else {
					setMessage('Account created. Signing you in...');
											// Auto sign-in after signup
											const signResult = (await signIn('credentials', { redirect: false, email, password })) as SignInResponse | undefined;
											if (signResult?.ok) {
						router.push('/dashboard');
					} else {
						setMode('login');
						setMessage('Please log in.');
					}
				}
			} else {
								const result = (await signIn('credentials', { redirect: false, email, password })) as SignInResponse | undefined;
								if (result?.ok) {
					router.push('/dashboard');
				} else {
										setMessage(result?.error || 'Invalid credentials');
				}
			}
				} catch (err: unknown) {
						// Log unexpected error for debugging
						console.error('Auth submit error', err);
						setMessage('Network error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-2 text-gray-900">{mode === 'signup' ? 'Create an account' : 'Welcome back'}</h2>
				<p className="text-sm text-gray-600 mb-6">{mode === 'signup' ? 'Sign up to save progress and get personalized recommendations.' : 'Log in to access your dashboard and saved data.'}</p>

				<div className="flex items-center gap-4 mb-6">
					<button
						onClick={() => setMode('signup')}
						className={`px-4 py-2 rounded-md ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
					>
						Sign up
					</button>
					<button
						onClick={() => setMode('login')}
						className={`px-4 py-2 rounded-md ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
					>
						Log in
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="mb-4">
						<button
							type="button"
							onClick={() => signIn('kinde')}
							className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md mb-2"
						>
							Sign in with Kinde
						</button>
					</div>
					{mode === 'signup' && (
						<div>
							<label className="block text-sm text-gray-700">Full name</label>
							<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-200 rounded-md p-2" placeholder="Your name" />
						</div>
					)}

					<div>
						<label className="block text-sm text-gray-700">Email</label>
						<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-200 rounded-md p-2" placeholder="you@example.com" />
					</div>

					<div>
						<label className="block text-sm text-gray-700">Password</label>
						<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 block w-full border border-gray-200 rounded-md p-2" placeholder="Choose a password" />
					</div>

					<div className="flex items-center justify-between">
						<button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
							{loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
						</button>
					</div>

					{message && <p className="text-sm text-red-600 mt-2">{message}</p>}
				</form>
			</div>
		</div>
	);
}

