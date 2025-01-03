import React, { useState, useEffect } from 'react';
import { Footer, Header } from './components/Header'; 
import TaskForm from './components/TaskForm'; 
import TaskList from './components/TaskList'; 
import Auth from './components/Auth'; 
import { saveTask, getTasks, getUserProfile } from './api/taskApi'; 
import UserDashboard from './components/UserDashboard'; 
import Profile from './components/Profile'; 
import './App.css'; 

const App = () => {
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Set initial state based on token
  const [tasks, setTasks] = useState([]); 
  const [activeView, setActiveView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle
  const [username, setUsername] = useState(''); // Store username
  const [profileData, setProfileData] = useState(null); // State for profile data

  const handleNavigation = (view) => {
    setActiveView(view);
    setIsMenuOpen(false); // Close menu after navigation
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout(); // Logout if 401 (Unauthorized) or 403 (Forbidden)
        }
      }
    };
    const fetchProfileData = async () => {
      try {
        const profile = await getUserProfile(); // Fetch profile data from API
        setProfileData(profile);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout(); // Logout if 401 (Unauthorized) or 403 (Forbidden)
        }
      }
    };
    if (isLoggedIn) {
      //fetchTasks(); 
      //fetchProfileData();
    }
    if (isLoggedIn) {
      setIsLoggedIn(true); // Set logged in status if token exists
      // You might also want to fetch user data here using the token
      fetchTasks(); 
      fetchProfileData();
      
    }
  }, [isLoggedIn]); 

  const handleSuccessfulLogin = (loggedInUsername) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTasks([]); 
    localStorage.removeItem('token'); // Add this line to remove the token
  };

  const handleTaskSave = async (newTask) => {
    try {
      await saveTask(newTask); 
      const updatedTasks = await getTasks();
      setTasks(updatedTasks); 
    } catch (error) {
      console.error('Error saving task:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout(); // Logout if 401 (Unauthorized) or 403 (Forbidden)
      }
    }
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(tasks.filter(task => task._id !== deletedTaskId));
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-container">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} tasks={tasks} toggleMenu={toggleMenu} username={username}/> {/* Pass toggleMenu */}

      {/* Conditionally render sidebar */}
      {isLoggedIn && (
        <nav className={`sidebar-nav ${isMenuOpen ? 'open' : ''}`}> 
          <ul>
            <li onClick={() => handleNavigation('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>
              Dashboard
            </li>
            <li onClick={() => handleNavigation('tasks')} className={activeView === 'tasks' ? 'active' : ''}>
              Tasks
            </li>
            <li onClick={() => handleNavigation('profile')} className={activeView === 'profile' ? 'active' : ''}>
              Profile
            </li>
          </ul>
        </nav>
      )}

      <main className="app-main">
        <div className="content-container"> 
          {isLoggedIn ? (
            <>
              {activeView === 'dashboard' && <UserDashboard tasks={tasks} />}
              {activeView === 'tasks' && (
                <>
                  <TaskForm onSave={handleTaskSave} />
                  <TaskList
                    tasks={tasks}
                    onTaskDelete={handleTaskDelete}
                    onTaskUpdate={handleTaskUpdate}
                    // Pass the function as a prop
                    setIsLoggedIn={setIsLoggedIn}
                  />
                </>
              )}
              {activeView === 'profile' && (
              <Profile profileData={profileData} /> // Pass profile data to Profile component
            )}
              {/* ... other views */}
            </>
          ) : (
            
            <Auth onSuccessfulLogin={handleSuccessfulLogin} />
          )}
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
