import './styles.css'
import Task from './task';
import { format, formatDistanceToNow, differenceInCalendarWeeks as differenceInWeeks } from '../node_modules/date-fns';

let allProjects = [];
let allTasks = [];
let todayTasks = [];
let thisWeekTasks = [];
let currentSection = allTasks;
const log = console.log;
const projectsEl = document.getElementById('projects');
const tasksEl = document.getElementById('tasks');
class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  } 
}

function createProject(name) {
  const project = new Project(name);
  allProjects.push(project);
}


function renderProjects() {
  projectsEl.innerHTML = '';

  for ( let i = 0; i < allProjects.length; i++  ) {
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
    <p>${allProjects[i].name}</p>
    <div class="delete-project" data-index="${i}">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
      </div>`;
      
    projectsEl.appendChild(projectEl);
    addEventDelete(i);
  }
  addProjectSelectionEvent();
  saveToLocalStorage();
}

function addEventDelete(i) {
  const deleteProjectBtn = document.querySelector(`[data-index="${i}"]`);
  
  deleteProjectBtn.addEventListener('click', (e) => {
    const targetIndex = e.currentTarget.dataset.index;
    const targetArray = allProjects[targetIndex].tasks;
    clearDeletedProjectTasks(targetArray);
    allProjects.splice(targetIndex, 1);
    selectInbox();
    renderProjects();
  });
}

function clearDeletedProjectTasks(targetProject) {
  for ( let i = 0 ; i < targetProject.length ; i++) {
    for ( let x = 0 ; x < allTasks.length ; x++ ) {
      if ( allTasks[x].name === targetProject[i].name ) {
        allTasks.splice(x, 1);
      }
    }

    for ( let x = 0 ; x < todayTasks.length ; x++ ) {
      if ( todayTasks[x].name === targetProject[i].name ) {
        todayTasks.splice(x, 1);
      }
    }
  }
}



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

  const inboxEl = document.getElementById('inbox'); // INBOX SELECT
  inboxEl.addEventListener('click', () => {
    currentSection = allTasks;
    renderTasks();
  });

  const todayEl = document.getElementById('today'); // TODAY SELECT
  todayEl.addEventListener('click', () => {
    currentSection = todayTasks
    renderTasks();
  });

  const thisWeekEl = document.getElementById('this-week'); // THIS WEEK SELECT
  thisWeekEl.addEventListener('click', () => {
    currentSection = thisWeekTasks;
    renderTasks();
  });

  for ( let i = 0; i < sectionNodes.length; i++ ) { // all section addEvent
    sectionNodes[i].addEventListener('click', (e) => {
      clearSelected();
      e.currentTarget.classList.add('selected');
      contentTitle.textContent = e.currentTarget.textContent.toUpperCase();
      const contentEl = document.getElementById("content");
      if( contentEl.classList.contains("hidden") ) {
        swapSections();
      }
    }, {capture: true});
  }

  for ( let i = 0; i < projectNodes.length; i++ ) { // project addEvent
    projectNodes[i].addEventListener('click', (e) => {
      const targetIndex = e.currentTarget.dataset.projectIndex;
      if (allProjects[targetIndex] !== undefined ) {
        currentSection = allProjects[targetIndex].tasks;
      }
      renderTasks();
    });
  }
};

function swapSections() { // SWAPPING TASKS AND FORM SECTIONS

  const taskTitle = document.getElementById('task-title');
  const taskDescription = document.getElementById('task-description');
  const taskDueDate = document.getElementById('task-due-date');
  const radioBtns = document.querySelectorAll('input[type="radio"]');
  let taskPriority = '';
  const taskContent = document.getElementById('content');
  const taskForm = document.getElementById('task-form');

  taskTitle.value = '';
  taskDescription.value = '';
  taskDueDate.value = '';
  taskPriority = '';

  for (let i = 0; i < radioBtns.length; i++) { // uncheck radio btns
    if (radioBtns[i].checked) {
      radioBtns[i].checked = false;
    }
  }

  taskContent.classList.toggle('hidden');
  taskForm.classList.toggle('hidden');
}



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
  if (taskTitle.value === '' || taskDueDate.value === '' || taskPriority === '') {
    alert('Please fill all fields');
    return;
  }
  if (taskDescription.value === '') {
    taskDescription.value = 'None';
  }
  const task = new Task(taskTitle.value, taskDescription.value, changeToDefaultFormat(taskDueDate.value), taskPriority);

  allTasks.push(task);
  checkIfToday(task);
  checkIfThisWeek(task);

  if (currentSection !== allTasks && currentSection !== todayTasks && currentSection !== thisWeekTasks) {
    currentSection.push(task);
  }

  swapSections();
  renderTasks();
}

function checkTask(e) { // CHECK TASK FUNCTIONALITY
  const targetTaskName = e.target.dataset.name;
  const targetTask = document.querySelector(`[data-task-name="${targetTaskName}"]`)
  targetTask.classList.add("checked-task");

  for ( let i = 0 ; i < allTasks.length ; i++ ) {
    if ( allTasks[i].name === targetTaskName ) {
      allTasks.splice(i, 1);
    }
  }

  for ( let i = 0 ; i < todayTasks.length ; i++ ) {
    if ( todayTasks[i].name === targetTaskName) {
      todayTasks.splice(i, 1);
    }
  }

  for ( let i = 0 ; i < thisWeekTasks.length ; i++ ) {
    if ( thisWeekTasks[i].name === targetTaskName) {
      thisWeekTasks.splice(i, 1);
    }
  }

  for ( let i = 0 ; i < allProjects.length ; i++ ) {
    const projectTasks = allProjects[i].tasks;
    for ( let i = 0 ; i < projectTasks.length ; i++ ) {
      if ( projectTasks[i].name === targetTaskName ) {
        projectTasks.splice(i, 1);
      }
    }
  }

  setTimeout(renderTasks, 250);
}

function showInfo(e) {
  const targetTask = e.currentTarget.dataset.info;
  const targetEl = document.querySelector(`[data-task-name="${targetTask}"]`)
  expand(targetEl, e);
}

function expand(element, e) {
  const task = currentSection[e.currentTarget.dataset.index];
  element.innerHTML = "";
  element.innerHTML = `
    <div class="descrip">Name: </div>
    <div class="task-title">${task.name}</div>
    <div class="descrip">Description: </div>
    <div class="task-description">${task.description}</div>
    <div class="descrip">Due date: </div>
    <div class="time">${task.dueDate}</div>
    <svg xmlns="http://www.w3.org/2000/svg" class="task-info" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>`
  const closeBtn = element.querySelector('.task-info');
  closeBtn.addEventListener('click', () => {
    element.classList.remove('expanded');
    element.innerHTML = "";
    setTimeout(renderTasks, 200);
  });
  closeBtn.classList.add('close-btn');
  element.classList.add('expanded');
}

function renderTasks() {

  tasksEl.innerHTML = "";
  for (let i = 0; i < currentSection.length; i++) {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');
    taskEl.dataset.taskName = currentSection[i].name;
    taskEl.innerHTML = `
      <div data-name="${currentSection[i].name}" data-index="${i}" class="check ${currentSection[i].priority}"></div>
      <div class="task-title">${currentSection[i].name}</div>
      <div class="time">${currentSection[i].dueDate}</div>
      <svg class="task-info" data-info="${currentSection[i].name}" data-index="${i}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>`;
      tasksEl.appendChild(taskEl);
      const checkBtn = taskEl.querySelector('.check');
      checkBtn.addEventListener('click', (e) => {
        checkTask(e);
      });
      const infoBtn = taskEl.querySelector('.task-info');
      infoBtn.addEventListener('click', (e) => {
        showInfo(e);
      })
  }
  if (currentSection.length === 0) {
    tasksEl.innerHTML = `<div id="no-tasks">No tasks here ...</div>`;
  }
  saveToLocalStorage();
}

function selectInbox() {
  const inbox = document.getElementById('inbox');
  inbox.classList.toggle('selected');
  const contentTitle = document.querySelector('.content-title');
  contentTitle.innerHTML = "INBOX";
  currentSection = allTasks;
  renderTasks();
};

function checkIfToday(task) {
  if ( task.dueDate === getCurrentDate()) {
    todayTasks.push(task);
  }
}

function checkIfThisWeek(task) {
  const thisDay = changeToFnsFormat(getCurrentDate());
  const taskDay = changeToFnsFormat(task.dueDate);
  if (differenceInWeeks(taskDay, thisDay) === 0) {
    thisWeekTasks.push(task);
  }
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const currentDate = format(new Date(year, month, day), 'dd/MM/yyyy');
  return currentDate;
}

function changeToDefaultFormat(date) {
  const dateArray = date.split("-")
  const dateFormated = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
  return dateFormated;
}

function changeToFnsFormat(date) {
  const dateArray = date.split("/")
  const fnsFormat = new Date(dateArray[2], dateArray[1]-1, dateArray[0])
  return fnsFormat;
}



function saveToLocalStorage() {
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
  localStorage.setItem("allProjects", JSON.stringify(allProjects));
  localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
  localStorage.setItem("thisWeekTasks", JSON.stringify(thisWeekTasks));
}

function getData() {
  allTasks = JSON.parse(localStorage.getItem("allTasks"));
  allProjects = JSON.parse(localStorage.getItem("allProjects"));
  todayTasks = JSON.parse(localStorage.getItem("todayTasks"));
  thisWeekTasks = JSON.parse(localStorage.getItem("thisWeekTasks"));
}

function initLocalStorage() {
  if ( localStorage.getItem("allTasks") === null ) {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }
  if ( localStorage.getItem("allProjects") === null ) {
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
  }
  if ( localStorage.getItem("todayTasks") === null ) {
    localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
  }
  if ( localStorage.getItem("thisWeekTasks") === null ) {
    localStorage.setItem("thisWeekTasks", JSON.stringify(thisWeekTasks));
  }
}

(function init() {
  initLocalStorage();
  getData();
  selectInbox();
  currentSection = allTasks;
  const submitTaskBtn = document.getElementById('submit-task');
  submitTaskBtn.addEventListener('click', submitTask);
  const addTaskBtn = document.getElementById('add-task');
  addTaskBtn.addEventListener('click', swapSections);
  const cancelTaskBtn = document.getElementById('cancel-task');
  cancelTaskBtn.addEventListener('click', swapSections);

  addProjectSelectionEvent();
  renderProjects();
})();

(function addProjectBtn() {
  const addProjectBtn = document.getElementById('add-project');
  
  addProjectBtn.addEventListener('click', () => {
    const projectName = prompt('Enter project name');
    if ( projectName === null || projectName === "" ) {
      return;
    }
    createProject(projectName);
    renderProjects();
  });
})();

//test