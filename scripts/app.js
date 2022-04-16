const form = document.getElementById('task-field');
const addBtn = document.getElementById('submit-btn');
const backlogEl = document.getElementById('backlog-container');
const inProgressEl = document.getElementById('in-progress-container');
const completedEl = document.getElementById('completed-container');

const backlog = [];
const inProgress = [];

function createTask(task) {
  const taskTemplate = document.getElementById('template');
  const taskBody = document.importNode(taskTemplate.content, true);
  taskBody.querySelector('div').setAttribute('id', task.id);
  taskBody.querySelector('p').textContent = task.value;
  backlogEl.append(taskBody);
  backlog.push(task);
}

function renderTask() {
  const task = {
    id: 1000 * Math.random().toFixed(3),
    value: form.querySelector('input').value,
  };
  createTask(task);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTask();
  updateBacklog();
  console.log(backlogEl);
});

function updateBacklog() {
  const backlogTasks = backlogEl.querySelectorAll('.task-box');
  backlogTasks.forEach((task) => {
    task.addEventListener('click', () => {
      inProgressEl.append(task);
      updateInProgress()
    });
  });
  console.log(backlogTasks);
  return backlogTasks;
}

function updateInProgress() {
  const inprogressTasks = inProgressEl.querySelectorAll('.task-box')
  console.log(inprogressTasks)
  inprogressTasks.forEach((task) => {
    task.addEventListener('click', () => {
      completedEl.append(task);
    })
  })
}