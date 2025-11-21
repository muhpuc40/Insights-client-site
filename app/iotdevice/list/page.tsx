"use client"

import { useState, useEffect } from "react"

interface Parameter {
  name: string
  value: string
}

interface Device {
  id: number
  name: string
  status: "active" | "inactive" | "not-functional"
  api_key: string
  parameters: Parameter[]
  created_at: string
}

export default function IotDeviceList() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null) // Add this line

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('https://ingeborg-phytotoxic-clotilde.ngrok-free.dev/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      const data = await response.json()

      if (data.status) {
        setDevices(data.data)
      } else {
        setError(data.message || 'Failed to fetch devices')
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "not-functional":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "🟢"
      case "inactive":
        return "🔴"
      case "not-functional":
        return "🟡"
      default:
        return "⚪"
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      alert('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading devices...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Devices</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {devices.length} device{devices.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Combined Header Section */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {device.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      ID: {device.id} • Created: {new Date(device.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)} flex-shrink-0 ml-2`}>
                    {getStatusIcon(device.status)} {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Combined API and Parameters Section */}
              <div className="p-4 space-y-4">
                {/* API URL */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    API Endpoint
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                      <code className="bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded text-sm font-mono text-gray-800 dark:text-gray-200 break-words leading-relaxed">
                        https://ingeborg-phytotoxic-clotilde.ngrok-free.dev/api/devices/{device.api_key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`https://ingeborg-phytotoxic-clotilde.ngrok-free.dev/api/devices/${device.api_key}`, `url-${device.id}`)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors duration-200 w-full flex items-center justify-center gap-1"
                      >
                        {copiedField === `url-${device.id}` ? (
                          <>
                            <span>✓</span>
                            <span>Copied</span>
                          </>
                        ) : (
                          'Copy URL'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {device.parameters.map((param, index) => (
                      <div key={index} className="flex flex-col p-2 bg-gray-50 dark:bg-slate-700 rounded">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {param.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {param.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {device.parameters.length} Parameter{device.parameters.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium transition-colors duration-200">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {devices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No devices found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first IoT device.
            </p>
            <button
              onClick={() => window.location.href = '/add-device'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Add Your First Device
            </button>
          </div>
        )}
      </div>
    </div>
  )
}