/******** TODO APP ********/
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let text = taskInput.value;
    let priority = priority.value;
    let date = dateInput.value;

    if (!text) return alert("Enter task");

    tasks.push({ text, priority, date, completed: false });
    taskInput.value = "";
    saveTasks();
    render();
}

function render(filter = "all") {
    taskList.innerHTML = "";
    let done = 0;

    tasks.forEach((t, i) => {
        if (filter === "completed" && !t.completed) return;
        if (filter === "pending" && t.completed) return;

        let div = document.createElement("div");
        div.className = `task ${t.completed ? "completed" : ""} ${t.priority.toLowerCase()}`;
        div.innerHTML = `
            ${t.text}
            <small>${t.priority} | ${t.date || "No date"}</small>
            <i class="fa-solid fa-check" onclick="toggle(${i})"></i>
            <i class="fa-solid fa-trash" style="right:30px" onclick="del(${i})"></i>
        `;
        taskList.appendChild(div);

        if (t.completed) done++;
    });

    counter.innerText = `Completed ${done} / ${tasks.length}`;
    progressBar.style.width = tasks.length ? (done / tasks.length) * 100 + "%" : "0%";
}

function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    saveTasks();
    render();
}

function del(i) {
    tasks.splice(i, 1);
    saveTasks();
    render();
}

function filterTasks(type) {
    render(type);
}

function searchTask() {
    let q = search.value.toLowerCase();
    document.querySelectorAll(".task").forEach(t => {
        t.style.display = t.innerText.toLowerCase().includes(q) ? "block" : "none";
    });
}

render();

/******** STICKY NOTE EDITOR ********/
const noteText = document.getElementById("noteText");
const editBtn = document.getElementById("editNote");
const saveBtn = document.getElementById("saveNote");

noteText.value = localStorage.getItem("stickyNote") || "";
noteText.setAttribute("readonly", true);
saveBtn.style.display = "none";

editBtn.onclick = () => {
    noteText.removeAttribute("readonly");
    noteText.focus();
    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
};

saveBtn.onclick = () => {
    localStorage.setItem("stickyNote", noteText.value);
    noteText.setAttribute("readonly", true);
    saveBtn.style.display = "none";
    editBtn.style.display = "inline";
};

/******** DRAG & MOVE STICKY NOTE ********/
const stickyNote = document.getElementById("stickyNote");
const noteHeader = document.getElementById("noteHeader");

let pos = JSON.parse(localStorage.getItem("stickyPosition"));
if (pos) {
    stickyNote.style.left = pos.left + "px";
    stickyNote.style.top = pos.top + "px";
}

let dragging = false, offsetX = 0, offsetY = 0;

noteHeader.addEventListener("mousedown", e => {
    dragging = true;
    offsetX = e.clientX - stickyNote.offsetLeft;
    offsetY = e.clientY - stickyNote.offsetTop;
});

document.addEventListener("mousemove", e => {
    if (!dragging) return;
    stickyNote.style.left = e.clientX - offsetX + "px";
    stickyNote.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    localStorage.setItem("stickyPosition", JSON.stringify({
        left: stickyNote.offsetLeft,
        top: stickyNote.offsetTop
    }));
});
