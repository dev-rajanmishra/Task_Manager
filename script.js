let deletebtn = document.querySelector(".delete");
let addbtn = document.querySelector(".add");
let allbtn = document.querySelector(".all");
let inputsearchbar = document.querySelector(".inputserach");
let searchbtn = document.querySelector(".srcbtn");
let ticketAdder = document.querySelector(".ticketAdder");
let ticketPriorityBox = document.querySelector(".ticketPriorityColor");
let ticketContainer = document.querySelector(".ticketContainer");
let allBoxs = document.querySelectorAll(".ticketPriorityColor .box");
let ticketGeneratorText = document.querySelector(".textPart");
let priorityColor = document.querySelector(".priorityColor");

let taskColor = "red";
let taskArray = [];
let oldData = localStorage.getItem("TaskManager");

if (oldData) {
    taskArray = [...JSON.parse(oldData)];
    ticketAdderFn(taskArray);
}

let colorArray = ['red', 'green', 'blue', 'black'];
let activeDelete = false;

addbtn.addEventListener("click", function() {
    ticketAdder.classList.toggle("noDisplay");
});

ticketPriorityBox.addEventListener("click", function(event) {
    let clickedBox = event.target;
    if (clickedBox.classList.contains("box")) {
        allBoxs.forEach(function(box) {
            box.classList.remove("border");
        });

        taskColor = clickedBox.classList[1];
        clickedBox.classList.add("border");
    }
});

ticketGeneratorText.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        let taskObj = {
            task: ticketGeneratorText.value,
            color: taskColor,
            id: Date.now(),
        };

        taskArray.push(taskObj);
        ticketGeneratorText.value = '';
        localStorage.setItem("TaskManager", JSON.stringify(taskArray));
        ticketAdderFn(taskArray);
        ticketAdder.classList.toggle("noDisplay");
    }
});

function ticketAdderFn(arr) {
    ticketContainer.innerHTML = '';

    arr.forEach(function(taskObj) {
        let ticket = document.createElement("div");
        ticket.classList.add("ticket");

        let { color, task, id } = taskObj;
        ticket.innerHTML = `<div class="colorBar ${color}"></div>
        <div class="inputArea">
            <p class='editTask'>${task}</p>
            <span class="lockIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16ZM7 11V13H9V11H7ZM7 14V16H9V14H7ZM7 17V19H9V17H7Z"></path>
                </svg>
            </span>
        </div>`;

        let lockbtn = ticket.querySelector(".lockIcon");
        let lock = true;
        lockbtn.addEventListener("click", function() {
            let editTask = ticket.querySelector(".editTask");
            if (lock) {
                editTask.setAttribute("contenteditable", "true");
                lockbtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM10 15V17H14V15H10Z"></path></svg>';
            } else {
                editTask.setAttribute("contenteditable", "false");
                let updatedTask = editTask.innerHTML;
                taskArray = taskArray.map((task) => task.id === id ? { ...task, task: updatedTask } : task);
                localStorage.setItem("TaskManager", JSON.stringify(taskArray));
                lockbtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16ZM7 11V13H9V11H7ZM7 14V16H9V14H7ZM7 17V19H9V17H7Z"></path></svg>';
            }
            lock = !lock;
        });

        ticket.addEventListener("dblclick", function() {
            if (activeDelete) {
                ticketContainer.removeChild(ticket);
                taskArray = taskArray.filter((taskObj) => taskObj.id !== id);
                localStorage.setItem("TaskManager", JSON.stringify(taskArray));
            }
        });

        let colorStrip = ticket.querySelector(".colorBar");
        colorStrip.addEventListener("click", function() {
            let prevColor = colorStrip.classList[1];
            let preIdx = colorArray.findIndex((color) => color === prevColor);
            let nextColorIdx = (preIdx + 1) % 4;
            let nextColor = colorArray[nextColorIdx];

            colorStrip.classList.replace(prevColor, nextColor);
            taskArray = taskArray.map((task) => task.id === id ? { ...task, color: nextColor } : task);
            localStorage.setItem("TaskManager", JSON.stringify(taskArray));
        });

        ticketContainer.appendChild(ticket);
    });
}

deletebtn.addEventListener("click", function() {
    activeDelete = !activeDelete;
    deletebtn.classList.toggle("red");
});

priorityColor.addEventListener("click", function(event) {
    let clickele = event.target;
    if (clickele.classList[0] === 'box') {
        let color = clickele.classList[1];
        let filteredArray = taskArray.filter((taskObj) => taskObj.color === color);
        ticketAdderFn(filteredArray);
    }
});

allbtn.addEventListener("click", function() {
    ticketAdderFn(taskArray);
});

searchbtn.addEventListener("click", function() {
    let searchQuery = inputsearchbar.value.toLowerCase();
    inputsearchbar.value = "";
    let filteredArray = taskArray.filter((taskObj) => taskObj.task.toLowerCase().includes(searchQuery));
    ticketAdderFn(filteredArray);
});
