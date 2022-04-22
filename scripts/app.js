const form = document.getElementById('task-field');
const addBtn = document.getElementById('submit-btn');
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
  console.log(containers);
  update();
});

function update() {
  containers.forEach((cont) => {
    const selected = cont.querySelectorAll('.task-box');
    console.log(selected);
    for (const task of selected) {
      console.log(task)
      const prevBtn = task.querySelector('.switch-btns button:first-of-type')
      const nextBtn = task.querySelector('.switch-btns button:last-of-type');
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

      // task.classList.add('completed-active');
      task.classList.add('active');
      console.log(classes)
      console.log(task)
      nextBtn.addEventListener('click', appendNextFun);
      prevBtn.addEventListener('click', appendPrevFun);
    };
  });
}

function appendNext(task) {
  if (task.parentElement.id == 'backlog-container') {
    inProgressEl.append(task);
    task.classList.add('inprogress-active')
  } else if (task.parentElement.id == 'inprogress-container' ) {
    completedEl.append(task);
    task.classList.remove('inprogress-active')
    task.classList.add('completed-active')
  }
  update()
}

function appendPrev(task) {
  console.log(task.parentElement.id)
  if (task.parentElement.id == 'completed-container') {
    console.log('bla')
    inProgressEl.append(task);
    task.classList.remove('completed-active')
    task.classList.add('inprogress-active')
  } else if (task.parentElement.id == 'inprogress-container' ) {
    backlogEl.append(task);
    task.classList.remove('inprogress-active')
    task.classList.add('backlog-active')
  }
  update()
}

// function nextTaskNav() {
//   const nextBtn = document.querySelector('.switch-btns button:last-of-type');
//   nextBtn.addEventListener('click', () => {
//     currentActive++;

//     if (currentActive < containers.length) {
//       currentActive = containers.length;
//     }

//     update();
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
