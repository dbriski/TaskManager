const form = document.getElementById('task-field');
const addBtn = document.getElementById('submit-btn');
const backlogEl = document.getElementById('backlog-container');
const inProgressEl = document.getElementById('inprogress-container');
const completedEl = document.getElementById('completed-container');
const controller = new AbortController();

let idVal = 1;
let draggedEl;

let currentActiveContainer = backlogEl;
let currentActiveTasks = backlogEl.querySelectorAll('.task-box');

let tasks = [];
let tasksBack = [];
let tasksInpr = [];
let tasksCompl = [];
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
  currentActiveTasks = backlogEl.querySelectorAll('.task-box');
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
  update(currentActiveTasks);
  // switchContainer(tasks);
  console.log(tasks)
  console.log(currentActiveContainer)
  console.log(currentActiveTasks)
  // updateBacklog();
});

// function switchContainer(task) {
//   const backlogTasks = backlogEl.querySelectorAll('.task-box');
//   const inprogressTasks = inProgressEl.querySelectorAll('.task-box');
//   const completedTasks = completedEl.querySelectorAll('.task-box');


// }

function update(currentActiveTasks) {
  console.log(currentActiveTasks)
  currentActiveTasks.forEach(task => {
    task.addEventListener('click', taskHandler.bind(this, task))
  })
}

function taskHandler(task) {
  if (task.parentElement.id == 'backlog-container') {
    inProgressEl.append(task);
    currentActiveTasks = inProgressEl.querySelectorAll('.task-box');
    currentActiveContainer = inProgressEl;
    update(currentActiveTasks)
  } else if (task.parentElement.id == 'inprogress-container') {
    completedEl.append(task);
    currentActiveTasks = completedEl.querySelectorAll('.task-box');
    currentActiveContainer = completedEl;
    update(currentActiveTasks)
  }
}

// DO ALL OVER AGAIN WITH ID TASK CHECK IN WHICH CONTAINER IT IS (TRY WITH IF CONDITION FOR EACH CONTAINER)
function updateBacklog() {
  // connectDrag(currentActiveContainer);
  // connectDroppable('inprogress');
  currentActiveContainer.forEach((task) => {
    task.addEventListener(
      'click',
      (event) => {
        if (event.target.closest('button')) {
          tasks = tasks.filter((t) => t.id === task.id);
          task.remove();
          idVal--;
          console.log(task.id);
        } else {
          const taskID = tasks.findIndex(t => t.id == task.id)
          const taskIDObj = tasks.find(t => t.id == task.id)
          if (taskIDObj) {
            tasksInpr.push(taskIDObj);
          }
          tasks.splice(taskID, 1)
          console.log(task.id)
          console.log(taskID)
          inProgressEl.append(task);
          console.log(currentActiveContainer);
          // updateInProgress();
        }
      },
      { signal: controller.signal }
    );
  });
  switchContainer(tasks);
  console.log(tasks)
  console.log(tasksInpr)
  console.log(currentActiveContainer);
  // return currentActiveContainer;
}

// function updateInProgress() {
//   const inprogressTasks = inProgressEl.querySelectorAll('.task-box');
//   console.log(inprogressTasks);
//   // connectDrag(inprogressTasks);
//   // connectDroppable('completed');
//   inprogressTasks.forEach((task) => {
//     task.addEventListener('click', (event) => {
//       if (event.target.closest('button')) {
//         tasks.filter((t) => t.id !== task.id);
//         task.remove();
//         console.log(tasks);
//       } else {
//         completedEl.append(task);
//         console.log(task.id);
//       }
//     });
//   });
// }

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
    console.log(event.target.id);
    console.log(type);
    if (event.target.id === `${type}-container`) {
      document.getElementById(dataId).click();
    }
    event.target.classList.remove('droppable');
  });
}
