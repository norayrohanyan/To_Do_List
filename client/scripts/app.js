function createTaskElement(taskData) {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const task = document.createElement('div');
  task.classList.add('card');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  checkbox.addEventListener('change', () => checkTask(checkbox, task, taskData._id));

  const taskText = document.createElement('input');
  taskText.type = 'text';
  taskText.readOnly = true;
  taskText.classList.add('text');
  taskText.value = taskData.value;

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', () => removeTask(task, taskData._id));

  const editButton = document.createElement('button');
  editButton.classList.add('editButton');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editTask(editButton, taskText, taskData._id));

  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);

  task.appendChild(checkbox);
  task.appendChild(taskText);
  task.appendChild(buttons);

  taskList.appendChild(task);
  taskInput.value = '';
}

async function loadTasks() {
    const response = await fetch('http://localhost:3003/todos');

    if (!response.ok) {
      alert('Failed to load tasks');
      return;
    }

    const tasks = await response.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(taskData => createTaskElement(taskData));
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');

  if (!taskInput.value) {
    alert("Insert task");
    return;
  }

  const response = await fetch('http://localhost:3003/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: taskInput.value }),
  });

  if (!response.ok) {
    alert('Failed to add task');
    return;
  }

  const taskData = await response.json();
  createTaskElement(taskData);
}
  async function removeTask(task, id) {
    const response = await fetch(`http://localhost:3003/todos/${id}`, {
      method: 'DELETE',
    });
    task.remove();
  }

  async function editTask(editButton, taskText, id) {
    if (editButton.textContent.toLowerCase() == "edit") {
        editButton.textContent = "Save";
        taskText.removeAttribute("readonly");
        taskText.focus();
    } 
    else {
      const response = await fetch(`http://localhost:3003/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: taskText.value }),
        });

        if (!response.ok) {
            alert('Failed to edit task');
            return;
        }

        const updatedTask = await response.json();
        taskText.value = updatedTask.value;
        editButton.textContent = "Edit";
        taskText.setAttribute("readonly", "readonly");
    }
}


async function checkTask(checkbox, task, id) {
  const response = await fetch(`http://localhost:3003/todos/${id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isChecked: checkbox.checked }),
  });

  if (!response.ok) {
      alert('Failed to edit task');
      return;
  }

  if (checkbox.checked) {
    task.classList.add('active');
  } else {
    task.classList.remove('active');
  }
}

document.getElementById('addButton').addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', loadTasks);
