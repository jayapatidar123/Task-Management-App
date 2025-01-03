// frontend/src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import './TaskList.css';
import { deleteTask, updateTask } from '../api/taskApi'; // Import deleteTask

const TaskList = ({ tasks, onTaskDelete, onTaskUpdate, setIsLoggedIn }) => { 
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Pagination state
  const [tasksPerPage, setTasksPerPage] = useState(5); // Make it controllable
  const [currentPage, setCurrentPage] = useState(1); // Reset to 1 when tasksPerPage changes


  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
          const priorityOrder = {
            'low': 1,
            'medium': 2,
            'high': 3
          };
          const priorityA = priorityOrder[a.priority.toLowerCase()] || 0;
          const priorityB = priorityOrder[b.priority.toLowerCase()] || 0;
          return priorityA - priorityB;
        } else if (sortBy === 'status') {
          const statusOrder = {
            'pending': 1,
            'in-progress': 2,
            'completed': 3
          };
          return statusOrder[a.status.toLowerCase()] - statusOrder[b.status.toLowerCase()];
        }
        return 0;
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, sortBy]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Handle changes to tasksPerPage input
  const handleTasksPerPageChange = (event) => {
    const newTasksPerPage = parseInt(event.target.value, 10);
    setTasksPerPage(newTasksPerPage);
    setCurrentPage(1); // Reset to page 1 when tasks per page changes
  };
  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId); 
        onTaskDelete(taskId); 
      } catch (error) {
        console.error("Error deleting task:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Ensure logout logic is executed after the error response is received
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      }
    }
  };
// Function to handle editing a task
const handleEdit = (task) => {
  setEditingTask({ ...task });
};

// Function to handle saving the edited task
const handleSaveEdit = async () => {
  try {
    // Validate editingTask (e.g., title is required)
    if (!editingTask.title) {
      alert('Task title is required!');
      return;
    }
    //console.log("Task ID being sent:", editingTask._id); // Add this line
    //console.log("Editing Task Data:", editingTask);
    /* const formattedDueDate = editingTask.dueDate 
      ? new Date(editingTask.dueDate).toISOString().slice(0, 10) // Get only "yyyy-MM-dd"
      : null; // Handle cases where dueDate might be empty */

    const updatedTask = await updateTask(editingTask._id, editingTask);

    onTaskUpdate(updatedTask); // Notify parent (App) about the update
    setEditingTask(null); 
  } catch (error) {
    console.error("Error updating task:", error.message);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Ensure logout logic is executed after the error response is received
      setIsLoggedIn(false);
      localStorage.removeItem('token');

      // Option 1: Force a re-render (less ideal)
      // This will force the component to re-render and reflect the logged-out state
      // However, it's generally better to let React handle re-renders based on state changes
      this.forceUpdate(); 

      // Option 2: Redirect to login (more common approach)
      // You can redirect the user to the login page after logout
      // Assuming you have a history object from react-router-dom
      // history.push('/login'); 
    }
  }
};

  // Function to handle changes in the edit form
  const handleEditChange = (e) => {
    setEditingTask({ ...editingTask, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="task-controls">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value={null}>Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="status">status</option> 
        </select>
      </div>
      <div className="pagination-controls">
        <label htmlFor="tasksPerPage">Tasks per page:</label>
        <select 
          id="tasksPerPage" 
          value={tasksPerPage} 
          onChange={handleTasksPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        {/* Pagination controls (updated to reset to page 1 if needed) */}
        <ul className="pagination">
          {Array(Math.ceil(filteredTasks.length / tasksPerPage))
            .fill()
            .map((_, index) => (
              <li 
                key={index} 
                className={currentPage === index + 1 ? 'active' : ''}
              >
                <button onClick={() => paginate(index + 1)}>{index + 1}</button>
              </li>
            ))}
        </ul>
      </div>
      {/* Task List Display in Table Format */}
      <table className="task-table">
        <thead>
          <tr>
            <th className="table-header">Title</th>
            <th className="table-header">Description</th>
            <th className="table-header">Due Date</th>
            <th className="table-header">Status</th>
            <th className="table-header">Edit</th>
          </tr>
        </thead>
        <tbody>
        {currentTasks.map((task, index) => (
              <tr key={task._id} className={`task-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                <td className="table-data">{task.title}</td> 
                <td className="table-data">{task.description}</td>
                <td className="table-data">{new Date(task.dueDate).toLocaleDateString()}</td> 
                <td className={`status-cell ${task.status.replace(/\s+/g, '-')}`}>
                  {task.status} 
                </td>
                {/* Edit/Save Actions */}
              <td className="action-buttons">
                {editingTask && editingTask._id === task._id ? (
                  // Edit Mode
                  <>
                    <input 
                        type="text" 
                        name="title" 
                        value={editingTask.title} 
                        onChange={handleEditChange} // Add this line 
                      />
                      <input
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 10) : ''} 
                      onChange={handleEditChange}
                      required
                    />
                      {/* Add other input fields for description, dueDate, etc. 
                          and attach handleEditChange to their onChange events */}
                    <button className="save-button Edit-btn" onClick={handleSaveEdit}>
                      Save
                    </button>
                    <button className="cancel-button Edit-btn" onClick={() => setEditingTask(null)}>
                      Cancel
                    </button>
                    </>
                ) : (
                  // Normal Mode
                  <>
                    <button className="edit-button" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
              </tr>
            ))}      
        </tbody>
      </table>
      
    </div>
  );
};

export default TaskList;
