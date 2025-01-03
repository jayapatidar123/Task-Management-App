// frontend/src/api/taskApi.js
import axios from 'axios';

export const getTasks = async () => {
   // const token = localStorage.getItem('token');
    //console.log("Token being sent:", token); // Add this line for debugging
    const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const saveTask = async (task) => {
    const response = await axios.post('http://localhost:5000/api/tasks', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  };

  export const updateTask = async (taskId, updatedTask) => {
    const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  };
  export const getUserProfile = async () => {
    const response = await axios.get('http://localhost:5000/api/auth/profile', { // Adjust the API endpoint as needed
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  };