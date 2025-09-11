"use client"

import { useState, useEffect } from "react"

interface Device {
  device_id: number
  machine_id: string
  location_id: number
  status: "active" | "inactive" | "Not functional"
}

interface ApiResponse<T> {
  status: boolean
  statusCode: number
  message: string
  data: T
}

export default function IotDeviceOperator() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newDevice, setNewDevice] = useState<{
    machine_id: string
    location_id: string
    status: "active" | "inactive" | "Not functional"
  }>({
    machine_id: "",
    location_id: "",
    status: "active",
  })

  // Fetch all devices on component mount
  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://insights-serverside-sigma.vercel.app/api/devices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<Device[]> = await response.json()
      
      if (result.status) {
        setDevices(result.data)
      } else {
        setError(result.message || 'Failed to fetch devices')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices')
      console.error('Error fetching devices:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDevice = async () => {
    if (!newDevice.machine_id || !newDevice.location_id) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://insights-serverside-sigma.vercel.app/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machine_id: newDevice.machine_id,
          location_id: parseInt(newDevice.location_id),
          status: newDevice.status,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<Device> = await response.json()
      
      if (result.status) {
        // Add the new device to the list
        setDevices([...devices, result.data])
        // Reset the form
        setNewDevice({ machine_id: "", location_id: "", status: "active" })
      } else {
        setError(result.message || 'Failed to add device')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device')
      console.error('Error adding device:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (device_id: number) => {
    console.log("Edit device:", device_id)
    // TODO: Implement edit functionality when API endpoint is available
  }

  const handleDelete = async (device_id: number) => {
    // TODO: Implement delete API call when endpoint is available
    // For now, just remove from local state
    setDevices(devices.filter((device) => device.device_id !== device_id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400"
      case "inactive":
        return "text-red-600 dark:text-red-400"
      case "Not functional":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Device Section */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Add Device</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="machineId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Machine Id
                </label>
                <input
                  id="machineId"
                  type="text"
                  value={newDevice.machine_id}
                  onChange={(e) => setNewDevice({ ...newDevice, machine_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter machine ID"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Location
                </label>
                <select
                  id="location"
                  value={newDevice.location_id}
                  onChange={(e) => setNewDevice({ ...newDevice, location_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">
                    Select Location
                  </option>
                  <option value="1" className="text-gray-900 dark:text-white">
                    Location 1
                  </option>
                  <option value="12" className="text-gray-900 dark:text-white">
                    Location 12
                  </option>
                  <option value="14" className="text-gray-900 dark:text-white">
                    Location 14
                  </option>
                  <option value="15" className="text-gray-900 dark:text-white">
                    Location 15
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  value={newDevice.status}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, status: e.target.value as "active" | "inactive" | "Not functional" })
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="active" className="text-gray-900 dark:text-white">
                    Active
                  </option>
                  <option value="inactive" className="text-gray-900 dark:text-white">
                    Inactive
                  </option>
                  <option value="Not functional" className="text-gray-900 dark:text-white">
                    Not functional
                  </option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddDevice}
              disabled={loading || !newDevice.machine_id || !newDevice.location_id}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Device'}
            </button>
          </div>
        </div>

        {/* Device List Section */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Device List</h2>
            <button
              onClick={fetchDevices}
              disabled={loading}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="p-6">
            {loading && devices.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No devices found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Machine Id</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Location Id</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr
                        key={device.device_id}
                        className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{device.machine_id}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{device.location_id}</td>
                        <td className={`py-3 px-4 ${getStatusColor(device.status)}`}>{device.status}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(device.device_id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(device.device_id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}