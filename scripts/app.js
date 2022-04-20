const form = document.getElementById('task-field');
const addBtn = document.getElementById('submit-btn');
const backlogEl = document.getElementById('backlog-container');
const inProgressEl = document.getElementById('inprogress-container');
const completedEl = document.getElementById('completed-container');

let idVal = 1;
let draggedEl;

let tasks = [];
const inProgress = [];

function createTask(task) {
  const taskTemplate = document.getElementById('template');
  const taskBody = document.importNode(taskTemplate.content, true);
  taskBody.querySelector('div').setAttribute('id', task.id);
  taskBody.querySelector('h3').textContent = `Task no. ${task.id}`;
  taskBody.querySelector('p').textContent = task.value;
  backlogEl.append(taskBody);
  tasks.push(task);
  form.querySelector('input').value = '';
}

function renderTask() {
  if (idVal === 0) {
    idVal = 1;
  }
  const task = {
    id: idVal++,
    value: form.querySelector('input').value,
  };
  createTask(task);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTask();
  updateBacklog();
});

function updateBacklog() {
  const backlogTasks = backlogEl.querySelectorAll('.task-box');
  connectDrag(backlogTasks);
  connectDroppable('inprogress');
  backlogTasks.forEach((task) => {
    task.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        tasks = tasks.filter((t) => t.id === task.id);
        task.remove();
        idVal--;
        console.log(tasks);
      } else {
        inProgressEl.append(task);
        updateInProgress();
      }
    });
  });
  console.log(backlogTasks);
  return backlogTasks;
}

function updateInProgress() {
  const inprogressTasks = inProgressEl.querySelectorAll('.task-box');
  connectDrag(inprogressTasks);
  connectDroppable('completed');
  inprogressTasks.forEach((task) => {
    task.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        tasks.filter((t) => t.id !== task.id);
        task.remove();
        console.log(tasks)
      } else {
        completedEl.append(task);
      }
    });
  });
}

function connectDrag(tasks) {
  tasks.forEach((task) => {
    task.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    });
  });
}

function connectDroppable(type) {
  const cont = document.querySelector('.column-container');

  cont.addEventListener('dragenter', (event) => {
    if (event.dataTransfer.types[0] === 'text/plain' && event.target !== cont) {
      event.target.closest('div').classList.add('droppable');
      event.preventDefault();
    }
  });

  cont.addEventListener('dragover', (event) => {
    if (event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
    }
  });

  cont.addEventListener('dragleave', (event) => {
    if (event.relatedTarget.closest('div') !== cont) {
      event.target.classList.remove('droppable');
    }
  });

  cont.addEventListener('drop', (event) => {
    const dataId = event.dataTransfer.getData('text/plain');
    console.log(event.target.id)
    console.log(type)
      if (event.target.id === `${type}-container` ) {
        document.getElementById(dataId).click(); 
      } 
    event.target.classList.remove('droppable');
  });
}
