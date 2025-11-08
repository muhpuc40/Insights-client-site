"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { IRootState } from '@/store';

interface DeviceData {
  id: number;
  device_id: number;
  data: Record<string, number>;
  created_at: string;
  device?: {
    id: number;
    name: string;
    status: string;
  };
}

interface Device {
  id: number;
  name: string;
  status: string;
  api_key: string;
  parameters: Array<{ name: string; value: string }>;
}

const Dashboard = () => {
  const { isDarkMode, rtlClass } = useSelector((state: IRootState) => state.themeConfig);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("today");
  const [latestDeviceData, setLatestDeviceData] = useState<DeviceData | null>(null);

  useEffect(() => {
    fetchDevices();
    fetchLatestDeviceData(); // Fetch latest data on component mount
  }, []);

  // When latest device data is fetched, automatically select that device
  useEffect(() => {
    if (latestDeviceData && latestDeviceData.device_id) {
      setSelectedDevice(latestDeviceData.device_id.toString());
    }
  }, [latestDeviceData]);

  useEffect(() => {
    if (devices.length > 0) {
      fetchDeviceData();
    }
  }, [selectedDevice, timeRange, devices]);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.106:8000/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status) {
        setDevices(data.data);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  // Fetch latest data from ANY device
  const fetchLatestDeviceData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.106:8000/api/devices/data/latest', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status) {
        setLatestDeviceData(data.data);
      } else {
        setLatestDeviceData(null);
      }
    } catch (error) {
      console.error('Error fetching latest device data:', error);
      setLatestDeviceData(null);
    }
  };

  const fetchDeviceData = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('authToken');
      
      const url = selectedDevice === "all" 
        ? `http://192.168.0.106:8000/api/devices/data/all?time_range=${timeRange}`
        : `http://192.168.0.106:8000/api/devices/${selectedDevice}/data?time_range=${timeRange}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status) {
        setDeviceData(data.data);
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "not-functional":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  // Calculate statistics
  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status === 'active').length;

  // Get device name for latest data
  const getLatestDeviceName = () => {
    if (!latestDeviceData) return "No device";
    return latestDeviceData.device?.name || `Device ${latestDeviceData.device_id}`;
  };

  // Get current device name for display
  const getCurrentDeviceName = () => {
    if (selectedDevice === "all") return "All Devices";
    const device = devices.find(d => d.id.toString() === selectedDevice);
    return device ? device.name : "Device";
  };

  return (
    <div className="dark:text-white">
      <div className="flex items-center gap-2 text-gray-500 dark:text-white mb-6">
        <span>{">"}</span> Dashboard
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              📱
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{totalDevices}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Devices</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              ✅
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activeDevices}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Devices</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              ⚡
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {latestDeviceData ? formatDate(latestDeviceData.created_at) : 'No data yet'}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Latest from {getLatestDeviceName()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Data Logs Card */}
      <div className="rounded-xl shadow p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Device Data Logs - {getCurrentDeviceName()}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Devices</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={() => {
                fetchDeviceData();
                fetchLatestDeviceData(); // Refresh latest data too
              }}
              disabled={dataLoading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {dataLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading device data...</p>
            </div>
          ) : deviceData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedDevice === "all" 
                  ? "No device data found for the selected time period." 
                  : "No data found for this device."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {deviceData.map((data) => (
                    <tr
                      key={data.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                    >
                      <td className="py-3 px-2 text-xs sm:text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{data.device?.name || `Device ${data.device_id}`}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap items-center gap-x-2 max-w-xs">
                          {Object.entries(data.data).map(([key, value]) => (
                            <span key={key} className="text-xs inline-flex items-center">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{key}:</span>
                              <span className="text-blue-600 dark:text-blue-400 font-mono ml-1">{value}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="whitespace-nowrap">
                          {formatDate(data.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination or Load More could go here */}
        {deviceData.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/20 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{deviceData.length}</span> records
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;