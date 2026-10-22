import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';

const FleetContext = createContext(null);

export const FleetProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [driverData, setDriverData] = useState(null);
  const [overviewKPIs, setOverviewKPIs] = useState(null);
  const [predictiveForecast, setPredictiveForecast] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch initial REST data
  const fetchData = useCallback(async () => {
    try {
      const [vRes, aRes, tRes, dRes, kpiRes, mRes] = await Promise.all([
        fetch('/api/vehicles').then((r) => r.json()),
        fetch('/api/alerts?resolved_status=false').then((r) => r.json()),
        fetch('/api/trips/active').then((r) => r.json()),
        fetch('/api/drivers/leaderboard').then((r) => r.json()),
        fetch('/api/analytics/overview').then((r) => r.json()),
        fetch('/api/maintenance/predictive-forecast').then((r) => r.json()),
      ]);

      if (vRes.success) {
        setVehicles(vRes.data);
        if (!selectedVehicle && vRes.data.length > 0) {
          setSelectedVehicle(vRes.data[0]);
        }
      }
      if (aRes.success) setAlerts(aRes.data);
      if (tRes.success) setActiveTrips(tRes.data);
      if (dRes.success) setDriverData(dRes.data);
      if (kpiRes.success) setOverviewKPIs(kpiRes.data);
      if (mRes.success) setPredictiveForecast(mRes.data);
    } catch (err) {
      console.error('Error fetching fleet data:', err);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    fetchData();

    // Socket.io event listeners
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleInitialState = (data) => {
      if (data.vehicles) setVehicles(data.vehicles);
      if (data.alerts) setAlerts(data.alerts);
      setLastUpdated(new Date());
    };

    const handleTelematicsUpdate = (data) => {
      if (data.vehicles) {
        setVehicles(data.vehicles);
        // Sync selected vehicle if open
        setSelectedVehicle((prev) => {
          if (!prev) return data.vehicles[0];
          const updated = data.vehicles.find((v) => v._id === prev._id || v.vehicleId === prev.vehicleId);
          return updated || prev;
        });
      }
      setLastUpdated(new Date());
    };

    const handleNewAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setToastMessage({
        title: `🚨 ${alert.severity} Alert: ${alert.type}`,
        message: alert.message,
        type: alert.severity,
      });

      // Clear toast after 5s
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('initial_state', handleInitialState);
    socket.on('telematics_update', handleTelematicsUpdate);
    socket.on('new_alert', handleNewAlert);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('initial_state', handleInitialState);
      socket.off('telematics_update', handleTelematicsUpdate);
      socket.off('new_alert', handleNewAlert);
    };
  }, [fetchData]);

  // Mark an alert as resolved
  const resolveAlert = async (alertId) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, { method: 'PUT' });
      const json = await res.json();
      if (json.success) {
        setAlerts((prev) => prev.filter((a) => a._id !== alertId));
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  // Mark all alerts as resolved
  const resolveAllAlerts = async () => {
    try {
      const res = await fetch('/api/alerts/resolve-all', { method: 'PUT' });
      const json = await res.json();
      if (json.success) {
        setAlerts([]);
      }
    } catch (err) {
      console.error('Failed to resolve all alerts:', err);
    }
  };

  // Trigger test simulated fault
  const injectFault = async (vehicleId, faultType) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/simulate-fault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faultType }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setToastMessage({
          title: '⚡ Fault Simulation Injected',
          message: data.message,
          type: 'Warning',
        });
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to inject fault:', err);
    }
  };

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        alerts,
        activeTrips,
        driverData,
        overviewKPIs,
        predictiveForecast,
        selectedVehicle,
        setSelectedVehicle,
        isConnected,
        lastUpdated,
        toastMessage,
        resolveAlert,
        resolveAllAlerts,
        injectFault,
        fetchData,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
