import React, { useState, useEffect, useCallback } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Switch from '@mui/material/Switch';
import './Notifications.css'; 

const Notifications = ({ tasks }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') === 'true' || false 
  );
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', areNotificationsEnabled);
  }, [areNotificationsEnabled]);

  const calculateNotifications = useCallback(() => {
    if (areNotificationsEnabled && tasks && tasks.length > 0) { 
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      oneDayFromNow.setHours(23, 59, 59, 999); 

      const dueSoon = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= oneDayFromNow;
      });

      const overdue = tasks.filter(task => new Date(task.dueDate) < now);

      const newNotifications = [];
      dueSoon.forEach(task => {
        newNotifications.push({
          message: `Task "${task.title}" is due soon!`,
          taskId: task._id,
        });
      });

      overdue.forEach(task => {
        newNotifications.push({
          message: `Task "${task.title}" is overdue!`,
          taskId: task._id,
        });
      });

      setNotifications(newNotifications);
    } else {
      setNotifications([]); 
    }
    setIsLoading(false); 
  }, [areNotificationsEnabled, tasks]); // <-- Dependencies for useCallback

  useEffect(() => {
    calculateNotifications();

    const intervalId = setInterval(calculateNotifications, 60000); 
    return () => clearInterval(intervalId);
  }, [tasks, calculateNotifications]); 
  

  const toggleNotificationsPanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleNotificationToggle = () => {
    setAreNotificationsEnabled(!areNotificationsEnabled);
  };

  return (
    <div className="notifications-container">
      <Badge 
        badgeContent={notifications.length} 
        color="error" 
        onClick={toggleNotificationsPanel}
        className="notifications-icon" // Add a class to the Badge
      > 
        <NotificationsIcon />
      </Badge>

      {isPanelOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <Switch
              checked={areNotificationsEnabled}
              onChange={handleNotificationToggle}
              color="primary"
            />
          </div>
          <div className="notifications-list">
            {isLoading ? ( 
              <div className="notification-item">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-item">No new notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {notification.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
