'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://insights-serverside-sigma.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.status && data.token) {
                // Save token to localStorage
                localStorage.setItem('authToken', data.token);
                
                // Optionally save user data
                localStorage.setItem('userData', JSON.stringify(data.data));
                
                // Redirect to home page
                router.push('/');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input 
                        id="Email" 
                        name="email"
                        type="email" 
                        placeholder="Enter Email" 
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input 
                        id="Password" 
                        name="password"
                        type="password" 
                        placeholder="Enter Password" 
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            
            <div>
                <label className="flex cursor-pointer items-center">
                    <input 
                        type="checkbox" 
                        className="form-checkbox bg-white dark:bg-black"
                        disabled={isLoading}
                    />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label>
            </div>
            
            <button 
                type="submit" 
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;