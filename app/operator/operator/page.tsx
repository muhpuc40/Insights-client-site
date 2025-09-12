"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role: string
}

const UserRegistration: React.FC = () => {
  const router = useRouter()
  
  // Demo data for user list (temporary until API is ready)
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "operator" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "operator" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "admin" },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
    role: string
  }>({
    name: "",
    email: "",
    password: "",
    role: "operator",
  })

  // Check if user is admin, redirect to home if not
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedData = JSON.parse(userData)
        if (parsedData.role !== 'admin') {
          router.replace('/')
          return
        }
      } else {
        // No user data found, redirect to home
        router.replace('/')
        return
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error)
      router.replace('/')
    }
  }, [router])

  // Register new user
  const registerUser = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields (Name, Email, Password)')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Prepare request body
      const requestBody = {
        name: formData.name,
        email: formData.email,
        role: formData.role, // Dynamic role selection
        password: formData.password
      }

      // Make API call
      const response = await fetch('https://insights-serverside-sigma.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (response.ok && result.status) {
        // Add new user to demo list (temporary until API integration)
        const newUser: User = {
          id: users.length + 1,
          name: formData.name,
          email: formData.email,
          role: formData.role
        }
        setUsers([...users, newUser])
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "operator",
        })
        
        setSuccess(`User registered successfully as ${formData.role}!`)
        setError(null)
      } else {
        setError('Failed to register user: ' + (result.message || 'Unknown error'))
      }
    } catch (err) {
      setError('Error registering user: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-6 text-center">User Registration</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password *
            </label>
            <input
              id="password"
              type="text"
              value={formData.password || "12345678"}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              User Role *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={registerUser}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded mt-6 transition-colors duration-200"
        >
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </section>

      {/* User List Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registered Users</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {users.length} users
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Role</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                          onClick={() => console.log('Edit user:', user.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                          disabled={loading}
                          onClick={() => console.log('Delete user:', user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Note about demo data */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <span className="font-semibold">Note:</span> This list currently shows demo data. 
            Once the list API is ready, it will be integrated to show real registered users.
          </p>
        </div>
      </section>

    </div>
  )
}

export default UserRegistration