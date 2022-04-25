// DOM constants
const writeTaskBtn = document.getElementById('write-task');
const backdrop = document.getElementById('backdrop');
const taskModal = document.getElementById('task-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addBtn = document.getElementById('confirm-btn');
const taskModalEl = document.getElementById('modal-container');
const backlogEl = document.getElementById('backlog');
const inProgressEl = document.getElementById('inprogress');
const completedEl = document.getElementById('completed');
const containers = document.querySelectorAll('.task-container');

// Global variables
let idVal = 1;
let draggedEl;
let tasks = [];

// Backdrop and  closing TaskModal interface
const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

const exitTaskModal = () => {
  toggleBackdrop();
  taskModalEl.classList.remove('visible');
};

// Create task from TaskModal interface
const createTask = (task) => {
  const taskTemplate = document.getElementById('template');
  const taskBody = document.importNode(taskTemplate.content, true);
  taskBody.querySelector('div').setAttribute('id', task.id);
  taskBody.querySelector('h3').textContent = `ID-${task.id} ${task.title}`;
  taskBody.querySelector('p').textContent = task.value;
  backlogEl.append(taskBody);
  tasks.push(task);
  taskModal.querySelector('input').value = '';
  taskModal.querySelector('#title-field input').value = '';
  taskModal.querySelector('#description-field textarea').value = '';
};

const renderTask = () => {
  if (idVal === 0) {
    idVal = 1;
  }
  const task = {
    id: idVal++,
    title: taskModal.querySelector('#title-field input').value,
    value: taskModal.querySelector('#description-field textarea').value,
  };
  createTask(task);
};

// Task Handler functions
function taskHandler() {
  containers.forEach((cont) => {
    const selected = cont.querySelectorAll('.task-box');
    for (const task of selected) {
      const removeBtn = task.querySelector('#title-row button:first-of-type');
      const prevBtn = task.querySelector('#button-row button:first-of-type');
      const nextBtn = task.querySelector('#button-row button:last-of-type');
      const classes = task.classList;
      const appendNextFun = appendNext.bind(this, task);
      const appendPrevFun = appendPrev.bind(this, task);
      if (classes[1] == 'active') {
        nextBtn.removeEventListener('click', appendNextFun);
        prevBtn.removeEventListener('click', appendPrevFun);
        continue;
      }

      task.classList.add('active');
      nextBtn.addEventListener('click', appendNextFun);
      prevBtn.addEventListener('click', appendPrevFun);
      removeBtn.addEventListener('click', removeTask.bind(this, task));

      connectDrag(task);
    }
  });
}

function appendNext(task) {
  if (task.parentElement.id == 'backlog') {
    inProgressEl.append(task);
    task.classList.add('inprogress-active');
  } else if (task.parentElement.id == 'inprogress') {
    completedEl.append(task);
    task.classList.remove('inprogress-active');
    task.classList.add('completed-active');
  }
  taskHandler();
}

function appendPrev(task) {
  if (task.parentElement.id == 'completed') {
    inProgressEl.append(task);
    task.classList.remove('completed-active');
    task.classList.add('inprogress-active');
  } else if (task.parentElement.id == 'inprogress') {
    backlogEl.append(task);
    task.classList.remove('inprogress-active');
    task.classList.add('backlog-active');
  }
  taskHandler();
}

function removeTask(task) {
  task.remove();
}

// Drag and Drop logic
const connectDrag = (task) => {
  task.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
    draggedEl = event.target;
  });
};

const connectDroppable = () => {
  document.addEventListener('dragover', (event) => {
    if (event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
    }
  });

  document.addEventListener('dragenter', (event) => {
    console.log(event.target)
    console.log(event.relatedTarget)
    if (event.target.classList[0] == 'task-container') {
      event.target.classList.add('droppable');
      event.preventDefault();
    }
  });

  document.addEventListener('dragleave', (event) => {
    event.target.classList.remove('droppable');
  });

  document.addEventListener('drop', (event) => {
    event.preventDefault();
    if (event.target.classList[0] == 'task-container') {
      event.target.classList.remove('droppable');
      event.target.appendChild(draggedEl);
    }
  });
};

connectDroppable();

// TaskModal events
writeTaskBtn.addEventListener('click', () => {
  toggleBackdrop();
  taskModalEl.classList.add('visible');
});

cancelBtn.addEventListener('click', () => {
  exitTaskModal();
});

backdrop.addEventListener('click', () => {
  exitTaskModal();
});

taskModal.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTask();
  taskHandler();
  exitTaskModal();
});
