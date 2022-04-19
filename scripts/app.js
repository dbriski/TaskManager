const form = document.getElementById('task-field');
const addBtn = document.getElementById('submit-btn');
const backlogEl = document.getElementById('backlog-container');
const inProgressEl = document.getElementById('inprogress-container');
const completedEl = document.getElementById('completed-container');

let idVal = 0;
let draggedEl;

const tasks = [];
const inProgress = [];

function createTask(task) {
  const taskTemplate = document.getElementById('template');
  const taskBody = document.importNode(taskTemplate.content, true);
  taskBody.querySelector('div').setAttribute('id', task.id);
  taskBody.querySelector('p').textContent = task.value;
  backlogEl.append(taskBody);
  tasks.push(task);
}

function renderTask() {
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
  connectDroppable('backlog');
  backlogTasks.forEach((task) => {
    task.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        task.remove();
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
  connectDroppable('inprogress');
  inprogressTasks.forEach((task) => {
    task.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        task.remove();
      } else {
        completedEl.append(task);
      }
    });
  });
}

function connectDrag(tasks) {
  tasks.forEach((task) => {
    task.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', task);
      event.dataTransfer.effectAllowed = 'move';
      event.target.style.background = 'purple';
    });
  });
}

function connectDroppable(type) {
  const container = document.querySelector(`#${type}-container`);

    container.addEventListener('dragenter', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        container.parentElement.classList.add('droppable');
        event.preventDefault();
      } else {
        console.log(container);
        console.log(event);
        throw new Error('no input');
      }
    });

    container.addEventListener('dragover', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
      }
    });

  // container.addEventListener('dragleave', (event) => {
  //   if (event.relatedTarget.closest(`#${type}-container` !== container)) {
  //     list.parentElement.classList.remove('droppable');
  //   }
  // });
}
