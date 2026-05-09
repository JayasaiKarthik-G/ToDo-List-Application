// 🌐 API CONFIG (PUT THIS AT TOP OF FILE)
const isLocal =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

const API = isLocal
    ? "http://localhost:10000/todos"
    : "https://todo-list-application-drpj.onrender.com/todos";
        
async function displayTask() {

    try{
        let res = await fetch(API);
        let data = await res.json();

        console.log("RAW DATA:", data);
        
        let todos = [];

        if (Array.isArray(data)) {
            todos = data;
        } else if (data && Array.isArray(data.todos)) {
            todos = data.todos;
        } else {
            todos = [];
        }

        console.log("PARSED TODOS:", todos);

        accessTask(todos);
        
    }
    catch(err){
        console.log("Error: " + err);
    }
    
}

function accessTask(arr = [], isSearch = false){

    let taskForm = document.getElementById("taskForm");
    let results = document.getElementById("results");

    if (!Array.isArray(arr) || arr.length === 0){

        if (!isSearch) {
            taskForm.style.display = "block";
        }

        results.innerHTML = `
            <div class="h-100 d-flex justify-content-center align-items-center">

                <div class="text-center">

                    <h2 class="fw-bold text-secondary mb-3">
                        No Active Tasks
                    </h2>

                    <p class="text-muted mb-4">
                        ${
                            isSearch
                            ? "No matching tasks found."
                            : "There are no tasks currently scheduled for you."
                        }
                    </p>

                    ${
                        !isSearch
                        ? ""
                        : `
                            <button
                                onclick="displayTask()"
                                class="btn btn-dark px-4">
                                Show All Tasks
                            </button>
                        `
                    }

                </div>

            </div>
        `;

        return;
    }

    let rows = "";
    arr.forEach(item => {
        rows += `
            <tr>
                <td class="w-50 p-2">${item.task}</td>
                <td class="w-30 p-2">${item.time}</td>
                <td class="w-10 p-2">
                    <button
                        class="btn btn-warning btn-sm w-100"
                        onclick="changeTask('${item.id}', '${item.task}', '${item.time}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </td>

                <td class="w-10 p-2">
                    <button
                        class="btn btn-danger btn-sm w-100"
                        onclick="removeTask('${item.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    });

    let table = `
        <table class="table table-hover mb-0">

            <thead class="table-dark sticky-top">
                <tr>
                    <th class="p-3">Task</th>
                    <th class="p-3">Time</th>
                    <th class="p-3">Change</th>
                    <th class="p-3">Remove</th>
                </tr>
            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;

    results.innerHTML = table;
}

function showUI() {
    const form = document.getElementById("taskForm");
    const results = document.getElementById("results");

    if (form) form.style.display = "block";
    if (results) results.style.display = "block";
}

async function getTask() {

    let allForms = document.forms;
    let taskForm = allForms.taskForm;

    let taskInput = taskForm.task.value.trim().toLowerCase();
    let timeInput = taskForm.time.value.trim().toLowerCase();

    if (taskInput === "" && timeInput === "") {
        alert("Enter task or time in input boxes");
        return;
    }

    try {
        
        let res = await fetch(API);
        let data = await res.json();

        let filteredData = data.filter(item => {

            let taskMatch = taskInput ? item.task.toLowerCase().includes(taskInput) : true;
            let timeMatch = timeInput ? item.time.toLowerCase().includes(timeInput) : true;

            return taskMatch && timeMatch;
        });

        accessTask(filteredData, true);
        console.log(filteredData);
        document.forms.taskForm.reset();

    } catch (err) {
        console.log("Error: " + err);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("taskForm");
    if (form) {
        form.addEventListener("submit", addTask);
    }
    displayTask();
});

async function addTask(e) {
    e.preventDefault();
    
    let allForms = document.forms;
    let taskForm = allForms.taskForm;
    let task = taskForm.task.value.trim();
    let time = taskForm.time.value.trim();

    //Validations
    if(task == "" || time == ""){
        alert("Please fill all the details.");
        return;
    }

    let taskPattern = /^[A-Za-z0-9\s]{3,50}$/;
    let checkTask = taskPattern.test(task);
    if(checkTask == false){
        alert("Please check your task prompt.");
        return;
    }

    let timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i;
    let checkTime = timePattern.test(time);
    if (checkTime == false) {
        alert("Enter time like 12:00 pm");
        return;
    }

    time = time.toLowerCase();

    // CHECK DUPLICATE
    try {

        let checkRes = await fetch(API);
        let checkData = await checkRes.json();

        let duplicate = checkData.some(item => {

            let existingTask = item.task.trim().toLowerCase();
            let existingTime = item.time.trim().toLowerCase();

            return (
                existingTask === task.toLowerCase() &&
                existingTime === time.toLowerCase()
            );
        });

        if (duplicate) {
            alert("Task already exists");
            document.forms.taskForm.reset();
            return;
        }

    }
    catch(err){
        console.log("Duplicate check error: " + err);
        return;
    }

    let obj = {
        task : task,
        time : time
    }

    try{

        let res = await fetch(API ,{
            method : "POST",
            headers : {
                "Content-Type":"application/json"
            },
            body : JSON.stringify(obj)
        });

        if (!res.ok) {
            throw new Error("Failed to add task");
        }
        
        console.log("Task uploaded successfully");

        let data = await res.json();
        console.log(data);
        await displayTask();
        document.forms.taskForm.reset();
    }
    catch(err){
        console.log("Error is: " + err);
    }
    
}

async function changeTask(id, oldTask, oldTime) {

    let newTask = prompt("Enter new task:", oldTask);
    let newTime = prompt("Enter new time (HH:MM):", oldTime);

    if (newTask === null && newTime === null){
        return;
    } 

    newTask = newTask ? newTask.trim() : "";
    newTime = newTime ? newTime.trim() : "";

    if (newTask === "") newTask = oldTask;
    if (newTime === "") newTime = oldTime;


    let taskPattern = /^[A-Za-z0-9\s]{3,50}$/;
    let checkTask = taskPattern.test(newTask);
    if (checkTask == false) {
        alert("Invalid task");
        return;
    }

    let timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i;
    let checkTime = timePattern.test(newTime);
    if (checkTime == false) {
        alert("Enter time like 12:00 pm");
        return;
    }

    newTime = newTime.toLowerCase();

    // CHECK DUPLICATE
    try {
        let checkRes = await fetch(API);
        let checkData = await checkRes.json();

        let duplicate = checkData.some(item => {

            return (
                item.id != id &&
                item.task.trim().toLowerCase() === newTask.toLowerCase() &&
                item.time.trim().toLowerCase() === newTime.toLowerCase()
            );
        });

        if (duplicate) {
            alert("Task already exists");
            document.forms.taskForm.reset();
            return;
        }

    }
    catch(err){
        console.log("Duplicate check error: " + err);
        return;
    }

    let obj = {
        task: newTask,
        time: newTime
    };

    try {
        let api = `${API}/${id}`;
        let res = await fetch(api, {
            method: "PATCH",  
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        if (!res.ok){
            throw new Error("Update failed");
        } 

        console.log("Task updated successfully");
        await displayTask();

    } catch (err) {
        console.log("Error: " + err);
    }
}

async function removeTask(id) {
    try {
        let api = `${API}/${id}`;

        let confirmDelete = confirm("want to delete?");
        if(confirmDelete == false){
            return;
        }

        let res = await fetch(api, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Failed to delete task");
        }
        
        console.log("Task deleted successfully");
        await displayTask();

    } catch (err) {
        console.log("Error: " + err);
    }
}

