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

	const handleGoogleSignIn = async () => {
		setMessage(null);
		setLoading(true);
		try {
			// Redirect to Google sign-in; NextAuth will handle the OAuth flow.
			await signIn('google', { callbackUrl: '/dashboard' });
		} catch (err) {
			console.error('Google sign-in error', err);
			setMessage('Google sign-in failed');
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

				<div className="mt-6">
					<div className="flex items-center gap-3">
						<hr className="flex-1 border-t border-gray-200" />
						<span className="text-sm text-gray-500">or</span>
						<hr className="flex-1 border-t border-gray-200" />
					</div>
					<div className="mt-4">
						<button
							onClick={handleGoogleSignIn}
							disabled={loading}
							className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50"
						>
							{/* Inline Google icon */}
							<span className="w-5 h-5">
								<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
									<path fill="#fbbc05" d="M43.6 20.5h-2.1v-.1H24v7.5h11.3c-1.6 4.4-5.6 7.6-10.7 7.6-6.3 0-11.5-5.1-11.5-11.5S18.3 12.5 24.6 12.5c3.1 0 5.9 1.2 8 3.3l5.1-5.1C35.6 7 30.3 4.5 24.6 4.5 12.9 4.5 3.6 13.8 3.6 25.5S12.9 46.5 24.6 46.5c11.8 0 20.9-8.6 20.9-21 0-1.4-.2-2.7-.9-4z"/>
							</svg>
							</span>
							<span className="text-sm font-medium">Sign in with Google</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}