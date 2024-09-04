document.getElementById('add-todo').addEventListener('click', function() {
    const taskInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const timeInput = document.getElementById('todo-time');

    const task = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (task !== '' && date !== '' && time !== '') {
        addTaskToList(task, date, time, false);
        taskInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
        saveTasks();
    }
});

function addTaskToList(task, date, time, completed) {
    const taskList = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
        saveTasks();
    });

    const taskText = document.createElement('span');
    taskText.textContent = `${task} (${date} at ${time})`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Delete';
    removeBtn.addEventListener('click', function() {
        taskList.removeChild(li);
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(removeBtn);
    taskList.appendChild(li);

    // Apply due date class
    const taskDueDate = new Date(`${date}T${time}`);
    const currentTime = new Date();
    const timeDifference = taskDueDate - currentTime;

    if (timeDifference < 0) {
        li.classList.add('overdue');
    } else if (timeDifference < 24 * 60 * 60 * 1000) { // Due within 24 hours
        li.classList.add('due-soon');
        setTaskReminder(task, timeDifference);
    }

    if (completed) {
        li.classList.add('completed');
    }

    // Sort the tasks after adding
    sortTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach(function(item) {
        const text = item.querySelector('span').textContent;
        const checkbox = item.querySelector('input[type="checkbox"]');
        const [taskPart, duePart] = text.split(' (Due: ');
        const [date, time] = duePart.replace(')', '').split(' at ');
        tasks.push({ task: taskPart.trim(), date, time, completed: checkbox.checked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        addTaskToList(task.task, task.date, task.time, task.completed);
    });
}

function sortTasks() {
    const taskList = document.getElementById('todo-list');
    const tasks = Array.from(taskList.children);

    tasks.sort(function(a, b) {
        const aText = a.querySelector('span').textContent;
        const bText = b.querySelector('span').textContent;

        const aDueDate = new Date(`${aText.split(' (Due: ')[1].replace(')', '').replace(' at ', 'T')}`);
        const bDueDate = new Date(`${bText.split(' (Due: ')[1].replace(')', '').replace(' at ', 'T')}`);

        return aDueDate - bDueDate;
    });

    tasks.forEach(function(task) {
        taskList.appendChild(task);
    });
}

function setTaskReminder(task, timeDifference) {
    setTimeout(function() {
        alert(`Reminder: The task "${task}" is due soon!`);
    }, timeDifference - 30 * 60 * 1000); // Reminder 30 minutes before due
}

document.getElementById('search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const tasks = document.querySelectorAll('.todo-item');
    
    tasks.forEach(function(task) {
        const taskText = task.querySelector('span').textContent.toLowerCase();
        if (taskText.includes(searchTerm)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
});

window.onload = loadTasks;
