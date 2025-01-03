# Task Manager

This is a simple task manager application built with a React frontend and a Node.js/Express backend.

## Features

- User authentication (signup/login)
- Create, read, update, and delete tasks
- Task status management (pending, in-progress, completed)

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Prerequisites

- **Node.js and npm:** Make sure you have Node.js and npm installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).
- **MongoDB:** Install and run a MongoDB instance on your local machine or use a cloud-based MongoDB service.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/task-manager.git 
   cd task-manager

Install dependencies:

	cd frontend
	npm install
	cd ../backend
	npm install
	Configuration:

## Backend:
	Create a .env file in the backend directory.
	Add the following environment variables to the .env file, replacing placeholders with your actual values:
	
	MONGO_URI=your_mongodb_connection_string
	JWT_SECRET=your_jwt_secret_key 
	PORT=your_desired_port (e.g., 5000)
	
	Generate a strong, random JWT secret key. You can use a tool like OpenSSL:
	openssl rand -base64 32
	
## Start the application:

	Open two terminal windows.
	In the first terminal, navigate to the frontend directory and run:
	npm start
	In the second terminal, navigate to the backend directory and run:
	npm start
	
## Access the application:

	Open your web browser and go to http://localhost:3000 (or your specified frontend port).
	
## Usage

	Signup/Login:

		If you are a new user, click on "Signup" to create an account.
		If you already have an account, enter your credentials and click "Login".
	
	Manage Tasks:

		Once logged in, you can create new tasks, view existing tasks, update task details, and mark tasks as complete.
		
## Contributing
	Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
		
