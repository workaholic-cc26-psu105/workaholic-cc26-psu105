export const addNotification = (title) => {
  const existing = JSON.parse(localStorage.getItem("notifications") || "[]");

  const newNotification = {
    id: Date.now(),
    title,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const updatedNotifications = [newNotification, ...existing].slice(0, 10);

  localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

  window.dispatchEvent(new Event("notificationsUpdated"));
};