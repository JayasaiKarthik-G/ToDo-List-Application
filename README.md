ToDo List Application

A simple and responsive ToDo List Application built using HTML, CSS, JavaScript, and json-server for backend storage.
This app allows users to add, search, update, and delete tasks with date and time support.

🌐 Frontend (Vercel)
---------------------
Add, manage, and organize your tasks here: https://to-do-list-application-chi-ten.vercel.app/

🔗 Backend API (Render)
------------------------
Your live backend API: https://todo-list-application-drpj.onrender.com/todos

📁 Project Structure
---------------------
ToDo-App/
│
├── backend/
│   ├── server.js
│   ├── db.json
│   ├── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md

🛠️ Technologies Used
---------------------
HTML5
CSS3
JavaScript (ES6)
Bootstrap
json-server
Render (Backend Hosting)
Vercel (Frontend Hosting)

⚙️ Features
------------
✅ Add Tasks: Users can create new tasks with:
--------------
1. Task name (only word characters and spaces)
2. Time (pattren format: 12:00 am/pm)
3. click post button


🔍 Search Tasks: Search functionality helps users quickly find tasks by:
-----------------
1. task name or time (shortcut)
2. click get button


✏️ Update Tasks: Modify existing tasks:
-----------------
1. Change task name or update time or both by click on edit icon in change column.


❌ Delete Tasks
----------------
1. Remove completed or unwanted tasks instantly by click on trash icon in remove column.


📋 Task List Management: Tasks are displayed in:
-------------------------
1. Organized table format
2. Latest task first order (this feacture is coming soon)
3. Responsive layout.


📱 Responsive Design: The application is fully responsive and works on:
----------------------
1. Desktop
2. Tablet
3. Mobile devices


🚀 How to Run Locally
----------------------
1. Clone Repository: git clone https://github.com/JayasaiKarthik-G/ToDo-List-Application.git
2.  Open Project: cd ToDo_List_Application


🔧 Backend Setup: Navigate to backend folder
------------------
1. go to folder: cd backend
2. Install dependencies: npm install
3. Start json-server: 
    1. npx json-server --watch db.json --port 10000
            OR
    2. node server.js

🌐 Backend Runs At local: http://localhost:10000/todos


💻 Frontend Setup: Navigate to frontend folder
-------------------
1. Open frontend: cd frontend
2. Run index.html using: VS Code Live Server Browser directly


🌐 API Configuration:
----------------------
In script.js:

Local Backend:
const API = "http://localhost:10000/todos";

Live Backend (Render)
const API = "https://todo-list-application-drpj.onrender.com/todos";


🔄 CRUD Operations:
--------------------
Operation	    Method	    Endpoint
---------       ------      --------
Get Tasks	    GET	        /todos
Add Task	    POST	    /todos
Update Task	    PUT/PATCH	/todos/:id
Delete Task	    DELETE	    /todos/:id
