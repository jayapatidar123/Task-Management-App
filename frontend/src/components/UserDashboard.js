import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import './UserDashboard.css'; 
import Chart from 'chart.js/auto'; 
import { CategoryScale } from 'chart.js'; 

Chart.register(CategoryScale); 

const UserDashboard = ({ tasks }) => {
  const taskSummary = {
    totalTasks: tasks.length,
    dueSoon: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const oneWeekFromToday = new Date();
      oneWeekFromToday.setDate(today.getDate() + 7);
      return dueDate > today && dueDate <= oneWeekFromToday;
    }).length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    inProgressTasks: tasks.filter(task => task.status === 'in-progress').length
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], 
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 3, 5, 2], 
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          taskSummary.pendingTasks,
          taskSummary.inProgressTasks,
          taskSummary.completedTasks,
        ],
        backgroundColor: ['#FFCE56', '#36A2EB', '#4BC0C0'],
        // Add data labels to show numbers
        datalabels: {
          // Display the value of each slice
          formatter: (value) => {
            return value;
          },
        },
      },
    ],
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>

      <div className="dashboard-container"> {/* Container for vertical layout */}
        <div className="task-summary">
          {/* ... (Your existing task summary cards) */}
          <div className="summary-card">
            <h3>Total Tasks</h3>
            <p>{taskSummary.totalTasks}</p>
          </div>
          <div className="summary-card">
            <h3>Due Soon</h3>
            <p>{taskSummary.dueSoon}</p>
          </div>
          {/* ... other summary cards ... */}
        </div>

        <div className="graphs">
          <div className="graph-item">
            <h3>Task Completion Over Time</h3>
            <Line data={lineChartData} />
          </div>

          <div className="graph-item">
            <h3>Task Distribution by Status</h3>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div> {/* End of dashboard-container */}
    </div>
  );
};

export default UserDashboard;
