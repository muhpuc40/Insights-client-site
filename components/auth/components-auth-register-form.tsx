'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import {
    useRouter
} from 'next/navigation';
import React, {
    useState
} from 'react';
const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        newsletter: false
    });
    const handleInputChange = (e: React.ChangeEvent < HTMLInputElement > ) => {
        const {
            id,
            value,
            type,
            checked
        } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'Newsletter' ? 'newsletter' : id.toLowerCase()]: type === 'checkbox' ? checked : value
        }));
    };
    const showToast = (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            setSuccess(message);
            // Auto hide success toast after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } else {
            setError(message);
        }
    };
    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
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
                role: "operator",
                password: formData.password
            };
            // Make API call
            const response = await fetch('https://iot.ieeepusb.org/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if (response.ok && data.status) {
                // Show success toast
                showToast('Registration successful! Please login to continue.', 'success');
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    newsletter: false
                });
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                // Handle API error
                const errorMessage = data.message || 'Registration failed. Please try again.';
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };
    return (<form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            {/* Success Toast */}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
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
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login redirect link */}
            <div className="text-center mt-4">
                <span className="text-white-dark">Already have an account? </span>
                <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="text-primary hover:underline font-medium"
                    disabled={loading}
                >
                    Sign In
                </button>
            </div>
        </form>);
};
export default ComponentsAuthRegisterForm;