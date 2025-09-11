'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        newsletter: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'Newsletter' ? 'newsletter' : id.toLowerCase()]: type === 'checkbox' ? checked : value
        }));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Basic validation
            if (!formData.name || !formData.email || !formData.password) {
                setError('Please fill in all required fields');
                return;
            }

            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long');
                return;
            }

            // Prepare request body
            const requestBody = {
                name: formData.name,
                email: formData.email,
                role: "operator", // Default role as per your example
                password: formData.password
            };

            // Make API call
            const response = await fetch('https://insights-serverside-sigma.vercel.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok && data.status) {
                // Success - redirect to login
                router.push('/auth/login');
            } else {
                // Handle API error
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            
            <div>
                <label htmlFor="Name">Name</label>
                <div className="relative text-white-dark">
                    <input 
                        id="Name" 
                        type="text" 
                        placeholder="Enter Name" 
                        className="form-input ps-10 placeholder:text-white-dark" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input 
                        id="Email" 
                        type="email" 
                        placeholder="Enter Email" 
                        className="form-input ps-10 placeholder:text-white-dark" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
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
                        type="password" 
                        placeholder="Enter Password" 
                        className="form-input ps-10 placeholder:text-white-dark" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                        disabled={loading}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            
            <div>
                <label className="flex cursor-pointer items-center">
                    <input 
                        id="Newsletter"
                        type="checkbox" 
                        className="form-checkbox bg-white dark:bg-black" 
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label>
            </div>
            
            <button 
                type="submit" 
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;