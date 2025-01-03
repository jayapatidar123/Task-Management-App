// frontend/src/components/Auth.js
import React, { useState } from 'react';
import { login, signup } from '../api/authApi';
import './Auth.css'; 

const Auth = ({ onSuccessfulLogin }) => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    // Rate limiting variables
    const [loginAttempts, setLoginAttempts] = useState(0);
    const maxLoginAttempts = 3; 
    const lockoutDuration = 30000; // 30 seconds in milliseconds
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [lockoutTimestamp, setLockoutTimestamp] = useState(null); 


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value); 
        else if (name === 'password') setPassword(value);
    };

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    }

    const validatePassword = () => {
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character (!@#$%^&*()_+)');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const validateUsername = () => {
        if (username.trim() === '') {
            setUsernameError('Username is required');
            return false;
        } else if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters long');
            return false;
        } else {
            setUsernameError('');
            return true;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLockedOut) {
            // Now you can access lockoutTimestamp here
            setMessage(`Too many login attempts. Please try again in ${Math.round((lockoutDuration - (Date.now() - lockoutTimestamp)) / 1000)} seconds.`);
            return;
        }

        if (mode === 'signup') {
            // For signup, validate both email and password and show specific errors
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            const isUsernameValid = validateUsername(); // Validate username

            if (!isEmailValid || !isPasswordValid || !isUsernameValid) {
                return; // Stop if either validation fails
            }

        } else if (mode === 'login') {
            // For login, only validate email format
            if (!validateEmail()) {
                return;
            }
        }
        try {
            if (mode === 'login') {
                let response = await login({ username, email, password }); 

                if (response.token) {
                    // Successful login
                    setLoginAttempts(0); 
                    setMessage('Login successful!');
                    //console.log("Login successful - ",response.username);
                    onSuccessfulLogin(response.username);  // Pass the username here

                } else {
                    // Handle incorrect login attempts
                    setLoginAttempts(loginAttempts + 1);

                    if (loginAttempts >= maxLoginAttempts) {
                        // Lockout user
                        setIsLockedOut(true); // Use setIsLockedOut to update state
                        setLockoutTimestamp(Date.now()); // Use setLockoutTimestamp to update state
                        setTimeout(() => {
                            setIsLockedOut(false);
                            setLoginAttempts(0); 
                            setMessage(''); 
                        }, lockoutDuration);
                        setMessage(`Too many login attempts. Please try again in ${Math.round(lockoutDuration / 1000)} seconds.`);
                    } else {
                        setMessage(`Invalid credentials. ${maxLoginAttempts - loginAttempts} attempts remaining.`);
                    }
                }
            } else { 
                await signup({ email, password, username }); 
                setMessage('Registration successful!');
            }
        } catch (error) {
           // Assuming your backend sends a 401 status for incorrect credentials
        if (error.response && error.response.status === 401) { 
            setLoginAttempts(loginAttempts + 1);

            if (loginAttempts >= maxLoginAttempts) {
                // ... (lockout logic remains the same) ...
                setIsLockedOut(true); // Use setIsLockedOut to update state
                        setLockoutTimestamp(Date.now()); // Use setLockoutTimestamp to update state
                        setTimeout(() => {
                            setIsLockedOut(false);
                            setLoginAttempts(0); 
                            setMessage(''); 
                        }, lockoutDuration);
                        setMessage(`Too many login attempts. Please try again in ${Math.round(lockoutDuration / 1000)} seconds.`);
            } else {
                setMessage(`Invalid credentials. ${maxLoginAttempts - loginAttempts} attempts remaining.`);
            }
        } else {
            // Handle other errors (e.g., network issues)
            console.error("Login error:", error);
            setMessage('An error occurred during login.'); 
        }
        }
    };

    return (
        <div className="auth-container"> 
            <div className="auth-form">
                <h2>{mode === 'login' ? 'Login' : 'Signup'}</h2>
                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && ( 
                        <div className="form-group">
                            <input 
                                type="text" 
                                name="username" 
                                value={username} 
                                onChange={handleUsernameChange} 
                                placeholder="Username" 
                                required 
                            />
                            {usernameError && <p className="error-message">{usernameError}</p>}
                        </div>
                    )}
                    <div className="form-group">
                        <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required /> 
                        {emailError && <p className="error-message">{emailError}</p>} 
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />
                        {(mode === 'signup' && passwordError) && <p className="error-message">{passwordError}</p>} 
                    </div>
                <p className="message">{message}</p>
                    <button type="submit" className="btn">{mode === 'login' ? 'Login' : 'Signup'}</button>
                </form>
                <button className="toggle-mode" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                    {mode === 'login' ? 'Signup instead' : 'Login instead'}
                </button>
            </div>
        </div>
    );
};

export default Auth;
