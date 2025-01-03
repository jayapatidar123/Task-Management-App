// frontend/src/components/TaskForm.js
import React, { useState } from 'react';
import './TaskForm.css'; // Import CSS file for styling

const TaskForm = ({ onSave }) => {
    const [task, setTask] = useState({ title: '', description: '', dueDate: '', status: 'pending' });

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task);
        setTask({ title: '', description: '', dueDate: '', status: 'pending' });
    };

    return (
        <form onSubmit={handleSubmit} className="task-form"> 
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={task.title} onChange={handleChange} placeholder="Title" required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={task.description} onChange={handleChange} placeholder="Description" />
            </div>
            <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input type="date" id="dueDate" name="dueDate" value={task.dueDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" name="status" value={task.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <button type="submit" className="btn">Save Task</button>
        </form>
    );
};

export default TaskForm;
