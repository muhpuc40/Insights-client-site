"use client"

import { useState } from "react"

interface Parameter {
  id: number
  name: string
  value: string
}

// Available data types for parameters
const DATA_TYPES = [
  { value: "int", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "string", label: "String" },
  { value: "boolean", label: "Boolean" },
  { value: "double", label: "Double" }
]

export default function AddDeviceForm() {
  const [formData, setFormData] = useState({
    deviceName: "",
    status: "active",
  })
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: 1, name: "", value: "" }
  ])
  const [loading, setLoading] = useState(false)
  const [apiInfo, setApiInfo] = useState<{api_url: string, api_key: string} | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleAddParameter = () => {
    const newId = parameters.length > 0 ? Math.max(...parameters.map(p => p.id)) + 1 : 1
    setParameters([...parameters, { id: newId, name: "", value: "" }])
  }

  const handleParameterChange = (id: number, field: keyof Parameter, value: string) => {
    setParameters(parameters.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ))
  }

  const handleRemoveParameter = (id: number) => {
    if (parameters.length > 1) {
      setParameters(parameters.filter(param => param.id !== id))
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleAddDevice = async () => {
    if (!formData.deviceName || !parameters.every(p => p.name && p.value)) {
      alert("Please fill in all required fields and all parameters")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      
      const response = await fetch('http://https://ingeborg-phytotoxic-clotilde.ngrok-free.dev/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceName: formData.deviceName,
          status: formData.status,
          parameters: parameters
        })
      })

      const data = await response.json()

      if (data.status) {
        setApiInfo({
          api_url: data.data.api_url,
          api_key: data.data.api_key
        })
        
        // Reset form
        setFormData({ deviceName: "", status: "active" })
        setParameters([{ id: 1, name: "", value: "" }])
      } else {
        alert(data.message || 'Failed to create device')
      }
    } catch (error) {
      console.error('Error creating device:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6">
      <div className="w-full mx-auto max-w-4xl">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-gray-900 dark:text-white text-lg font-medium mb-6">Add New Device</h2>

          {/* API Info Display */}
          {apiInfo && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-green-800 dark:text-green-200 font-semibold text-base">New Device Created Successfully!</h3>
                <button
                  onClick={() => setApiInfo(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-lg"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                {/* API URL */}
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">API URL:</span>
                    <button
                      onClick={() => copyToClipboard(apiInfo.api_url, 'url')}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {copiedField === 'url' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-xs break-all bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {apiInfo.api_url}
                  </code>
                </div>

                {/* API Key */}
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">API Key:</span>
                    <button
                      onClick={() => copyToClipboard(apiInfo.api_key, 'key')}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {copiedField === 'key' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-xs break-all bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block font-mono">
                    {apiInfo.api_key}
                  </code>
                </div>

                <p className="text-green-700 dark:text-green-300 text-xs">
                  Use this API endpoint to send data from your IoT device. The data format should match your parameters.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Device Name and Status in same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Device Name
                </label>
                <input
                  type="text"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  placeholder="Enter device name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="not-functional">Not functional</option>
                </select>
              </div>
            </div>

            {/* Parameters Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Parameters
                </label>
                <button
                  type="button"
                  onClick={handleAddParameter}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  <span>+</span>
                  Add Parameter
                </button>
              </div>

              <div className="space-y-3">
                {parameters.map((parameter) => (
                  <div key={parameter.id} className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <input
                        type="text"
                        value={parameter.name}
                        onChange={(e) => handleParameterChange(parameter.id, 'name', e.target.value)}
                        placeholder="Parameter name (e.g., temperature)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <select
                        value={parameter.value}
                        onChange={(e) => handleParameterChange(parameter.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select data type</option>
                        {DATA_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {parameters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParameter(parameter.id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-200 w-full sm:w-auto text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddDevice}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 text-sm"
            >
              {loading ? 'Creating Device...' : 'Add Device'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}