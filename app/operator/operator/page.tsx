"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Operator {
  operator_id: number
  employee_id: string
  operator_name: string
  position: string
  picture_url?: string
  rfid_tag: string
}

const OperatorManagement: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newOperator, setNewOperator] = useState<{
    operator_name: string
    employee_id: string
    position: string
    picture_url: string
    rfid_tag: string
  }>({
    operator_name: "",
    employee_id: "",
    position: "",
    picture_url: "",
    rfid_tag: "",
  })

  // Fetch operators from API
  const fetchOperators = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://insights-serverside-sigma.vercel.app/api/operators')
      const result = await response.json()
      
      if (result.status) {
        setOperators(result.data)
      } else {
        setError('Failed to fetch operators')
      }
    } catch (err) {
      setError('Error fetching operators: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Add new operator
  const addOperator = async () => {
    // Validate required fields
    if (!newOperator.operator_name || !newOperator.employee_id || !newOperator.position) {
      setError('Please fill in all required fields (Name, Employee ID, Position)')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('https://insights-serverside-sigma.vercel.app/api/operators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperator),
      })

      const result = await response.json()

      if (result.status) {
        // Reset form
        setNewOperator({
          operator_name: "",
          employee_id: "",
          position: "",
          picture_url: "",
          rfid_tag: "",
        })
        
        // Refresh operators list
        await fetchOperators()
        
        setError(null)
      } else {
        setError('Failed to add operator: ' + result.message)
      }
    } catch (err) {
      setError('Error adding operator: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Load operators on component mount
  useEffect(() => {
    fetchOperators()
  }, [])

  return (
    <div className="container mx-auto p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Operator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={newOperator.operator_name}
              onChange={(e) => setNewOperator({ ...newOperator, operator_name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee ID *
            </label>
            <input
              id="employeeId"
              type="text"
              value={newOperator.employee_id}
              onChange={(e) => setNewOperator({ ...newOperator, employee_id: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter employee ID"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Position *
            </label>
            <input
              id="position"
              type="text"
              value={newOperator.position}
              onChange={(e) => setNewOperator({ ...newOperator, position: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter position"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Picture URL
            </label>
            <input
              id="picture"
              type="text"
              value={newOperator.picture_url}
              onChange={(e) => setNewOperator({ ...newOperator, picture_url: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter picture URL"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rfidTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              RFID Tag
            </label>
            <input
              id="rfidTag"
              type="text"
              value={newOperator.rfid_tag}
              onChange={(e) => setNewOperator({ ...newOperator, rfid_tag: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter RFID tag"
              disabled={loading}
            />
          </div>
        </div>
        <button
          onClick={addOperator}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mt-4"
        >
          {loading ? 'Adding...' : 'Add Operator'}
        </button>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Operators</h2>
          <button
            onClick={fetchOperators}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {loading && operators.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">Loading operators...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Operator ID</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Employee ID</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Position</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">RFID Tag</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No operators found
                    </td>
                  </tr>
                ) : (
                  operators.map((operator) => (
                    <tr
                      key={operator.operator_id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{operator.operator_id}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{operator.employee_id}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{operator.operator_name}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{operator.position}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{operator.rfid_tag || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
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
        )}
      </section>
    </div>
  )
}

export default OperatorManagement