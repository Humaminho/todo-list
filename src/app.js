import './styles.css'
import Task from './task';

const projectsArray = []; // PROJECTS ARRAY
const allTasks = []; // TASKS
let currentProject = null; // CURRENT PROJECT
const log = console.log;
const projectsEl = document.getElementById('projects'); // PROJECTS DOM
const tasksEl = document.getElementById('tasks'); // TASKS DOM
class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  } 
}

function createProject(name) { // CREATE PROJECT
  const project = new Project(name);
  projectsArray.push(project);
}

function addEventDelete(i) { // ADDING EVENT LISTENER TO DELETE PROJECT BUTTON
  const deleteProjectBtn = document.querySelector(`[data-index="${i}"]`);
  
  deleteProjectBtn.addEventListener('click', (e) => {
    const targetIndex = e.target.dataset.index;
    projectsArray.splice(targetIndex, 1);
    renderProjects(projectsArray);
  });
}

function renderProjects(projectsArray) { // RENDER PROJECTS
  projectsEl.innerHTML = '';

  for ( let i = 0; i < projectsArray.length; i++  ) {
    const projectEl = document.createElement('div');
    projectEl.classList.add('project');
    projectEl.classList.add('section');
    projectEl.dataset.projectIndex = i;
    projectEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
      <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
      <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
    </svg>
    <p>${projectsArray[i].name}</p>
    <div class="delete-project" data-index="${i}">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
    </div>`;

    projectsEl.appendChild(projectEl);
    addEventDelete(i);
  }
  addProjectSelectionEvent();
}

(function addProjectBtn() { // ADDING PROJECT BUTTON FUNCTIONNALITY
  const addProjectBtn = document.getElementById('add-project');

  addProjectBtn.addEventListener('click', () => {
    const projectName = prompt('Enter project name');
    createProject(projectName);
    renderProjects(projectsArray);
  });
})();

function clearSelected() { // CLEAR SELECTED CLASS
  const sectionNodes = document.querySelectorAll('.section');

  for ( let i = 0; i < sectionNodes.length; i++ ) {
    sectionNodes[i].classList.remove('selected');
  }
}

function addProjectSelectionEvent() { // ADDING PROJECT SELECTION EVENT
  const projectNodes = document.querySelectorAll('.project');
  const sectionNodes = document.querySelectorAll('.section');
  const contentTitle = document.querySelector('.content-title');

  for ( let i = 0; i < sectionNodes.length; i++ ) {
    sectionNodes[i].addEventListener('click', (e) => {
      clearSelected();
      e.currentTarget.classList.add('selected');
      currentProject = null;
      console.log(contentTitle)
      contentTitle.textContent = e.currentTarget.textContent;
    });
  }

  for ( let i = 0; i < projectNodes.length; i++ ) {
    projectNodes[i].addEventListener('click', (e) => {
      const targetIndex = e.currentTarget.dataset.projectIndex;
      currentProject = projectsArray[targetIndex];
      renderTasks(currentProject.tasks);
      console.log(currentProject);
    });
  }
};

function swapSections() { // SWAPPING TASKS AND FORM SECTIONS
  const taskContent = document.getElementById('content');
  const taskForm = document.getElementById('task-form');

  taskContent.classList.toggle('hidden');
  taskForm.classList.toggle('hidden');
}

const addTaskBtn = document.getElementById('add-task');
addTaskBtn.addEventListener('click', swapSections);

function submitTask() { // SUBMITTING TASK !!!!
  const taskTitle = document.getElementById('task-title');
  const taskDescription = document.getElementById('task-description');
  const taskDueDate = document.getElementById('task-due-date');
  const radioBtns = document.querySelectorAll('input[type="radio"]');
  let taskPriority = '';
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      taskPriority = radioBtns[i].value;
    }
  }
  if (taskTitle.value === '' || taskDescription.value === '' || taskDueDate.value === '' || taskPriority === '') {
    alert('Please fill all fields');
    return;
  }
  const task = new Task(taskTitle.value, taskDescription.value, taskDueDate.value, taskPriority, currentProject);
  allTasks.push(task);
  if (currentProject !== null) {
    currentProject.tasks.push(task);
  }
  swapSections();
  renderTasks(allTasks);

  taskTitle.value = '';
  taskDescription.value = '';
  taskDueDate.value = '';
  taskPriority = '';
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      radioBtns[i].checked = false;
    }
  }
}

const submitTaskBtn = document.getElementById('submit-task');
submitTaskBtn.addEventListener('click', submitTask);

addProjectSelectionEvent();

function renderTasks(tasks) { // RENDERING TASKS
  if (tasks === undefined) {
    return;
  }
  if (tasks.length === 0) {
    return;
  }
  const taskEl = document.createElement('div');
  taskEl.classList.add('task');
  for (let i = 0; i < tasks.length; i++) {
    taskEl.innerHTML = `
      <div class="check ${tasks[i].priority}"></div>
      <div class="task-title">${tasks[i].name}</div>
      <div class="time">${tasks[i].dueDate}</div>
      <svg class="task-info" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
      <svg class="remove-task" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>`;
  }
  tasksEl.appendChild(taskEl);
}

