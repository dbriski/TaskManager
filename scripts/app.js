const submitTask = document.getElementById('task-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addBtn = document.getElementById('confirm-btn');
const writeTaskBtn = document.getElementById('write-task');
const backdrop = document.getElementById('backdrop');
const taskModalEl = document.getElementById('modal-style');
const backlogEl = document.getElementById('backlog-container');
const inProgressEl = document.getElementById('inprogress-container');
const completedEl = document.getElementById('completed-container');
const containers = document.querySelectorAll('.task-container');

let idVal = 1;
let draggedEl;

let currentActive = 1;

let tasks = [];

function createTask(task) {
  const taskTemplate = document.getElementById('template');
  const taskBody = document.importNode(taskTemplate.content, true);
  taskBody.querySelector('div').setAttribute('id', task.id);
  taskBody.querySelector('h3').textContent = `ID-${task.id} ${task.title}`;
  taskBody.querySelector('p').textContent = task.value;
  backlogEl.append(taskBody);
  tasks.push(task);
  submitTask.querySelector('input').value = '';
  submitTask.querySelector('#title-field input').value = '';
  submitTask.querySelector('#description-field textarea').value = '';
}

function renderTask() {
  console.log(submitTask.querySelector('#title-field input').value);
  if (idVal === 0) {
    idVal = 1;
  }
  const task = {
    id: idVal++,
    title: submitTask.querySelector('#title-field input').value,
    value: submitTask.querySelector('#description-field textarea').value,
  };
  createTask(task);
}

const exitTaskModal = () => {
  toggleBackdrop();
  taskModalEl.classList.remove('visible');
};

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

function taskRender() {
  containers.forEach((cont) => {
    const selected = cont.querySelectorAll('.task-box');
    console.log(selected);
    for (const task of selected) {
      console.log(task);
      const removeBtn = task.querySelector('#title-box button:first-of-type');
      const prevBtn = task.querySelector('#button-box button:first-of-type');
      const nextBtn = task.querySelector('#button-box button:last-of-type');
      const classes = task.classList;
      const appendNextFun = appendNext.bind(this, task);
      const appendPrevFun = appendPrev.bind(this, task);
      // console.log(classes)
      if (classes[1] == 'active') {
        console.log('bla');
        nextBtn.removeEventListener('click', appendNextFun);
        prevBtn.removeEventListener('click', appendPrevFun);
        continue;
      }

      task.classList.add('active');
      console.log(classes);
      console.log(task);
      nextBtn.addEventListener('click', appendNextFun);
      prevBtn.addEventListener('click', appendPrevFun);
      removeBtn.addEventListener('click', removeTask.bind(this, task));

      connectDrag(task);
    }
  });
}

function appendNext(task) {
  if (task.parentElement.id == 'backlog-container') {
    inProgressEl.append(task);
    task.classList.add('inprogress-active');
  } else if (task.parentElement.id == 'inprogress-container') {
    completedEl.append(task);
    task.classList.remove('inprogress-active');
    task.classList.add('completed-active');
  }
  taskRender();
}

function appendPrev(task) {
  console.log(task.parentElement.id);
  if (task.parentElement.id == 'completed-container') {
    console.log('bla');
    inProgressEl.append(task);
    task.classList.remove('completed-active');
    task.classList.add('inprogress-active');
  } else if (task.parentElement.id == 'inprogress-container') {
    backlogEl.append(task);
    task.classList.remove('inprogress-active');
    task.classList.add('backlog-active');
  }
  taskRender();
}

function removeTask(task) {
  task.remove();
}

function connectDrag(task) {
  task.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
    draggedEl = event.target;
  });
}

function connectDroppable() {
  document.addEventListener('dragover', (event) => {
    if (event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
    }
  });

  document.addEventListener('dragenter', (event) => {
    if (event.target.className == 'task-container') {
      event.target.classList.add('droppable');
      event.preventDefault();
    }
  });

  document.addEventListener('dragleave', (event) => {
    if (event.target.classList[0] == 'task-container') {
      event.target.classList.remove('droppable');
    }
  });

  document.addEventListener('drop', (event) => {
    event.preventDefault();
    if (event.target.classList[0] == 'task-container') {
      event.target.classList.remove('droppable');
      event.target.appendChild(draggedEl);
    }
  });
}

// Button events
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

submitTask.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTask();
  taskRender();
  exitTaskModal();
});

connectDroppable();
