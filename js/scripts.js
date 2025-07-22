const themeSwitcher = document.getElementById("theme-switcher");
const body = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const addinput = document.getElementById("addt");
const list = document.querySelector(".todos");
const card = document.querySelector(".card");
const toggle = document.getElementById("themeToggle");
const itemsLeft = document.getElementById("items-left");
const completedBtnFilter=document.getElementById("completed")
const activeBtnFilter=document.getElementById("active")
const allBtnFilter=document.getElementById("all")
const filter=document.querySelector(".filter")
const btnFilters=document.getElementById("clear-completed")

function main() {
  //make newelement item for storage Datas & set value for items lfet
  const savedTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
  savedTasks.forEach((item) => makenewtask(item));
  // Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

  // theme switcher-----------------------------------//
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  // dragging part-----------------------------------//
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (
      e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")
    ) {
      const draggingLi = document.querySelector(".dragging");
      const listLi = [...list.querySelectorAll(".card")];
      const currentpos = listLi.indexOf(draggingLi);
      const newpo = listLi.indexOf(e.target);
      if (currentpos > newpo) {
        list.insertBefore(draggingLi, e.target);
      } else {
        list.insertBefore(draggingLi, e.target.nextSibling);
      }
      const todos = JSON.parse(localStorage.getItem("Tasks"));
      const remove = todos.splice(currentpos, 1);

      todos.splice(newpo, 0, remove[0]);
      localStorage.setItem("Tasks", JSON.stringify(todos));
    }
  });
  // Enter key event listener---------------------------//
  addinput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      addBtn.click();
      updateItemsLeft();
    }
  });
  //Add tasks to localstorage
  addBtn.addEventListener("click", () => {
    const item = addinput.value.trim();
    if (item != "") {
      addinput.value = "";
      const todos = !localStorage.getItem("Tasks")
        ? []
        : JSON.parse(localStorage.getItem("Tasks"));
      //or
      // const todos = JSON.parse(localStorage.getItem("Tasks")) || [];

      const tasks = {
        task: item,
        iscompleted: false,
      };
      todos.push(tasks);

      localStorage.setItem("Tasks", JSON.stringify(todos));
      // itemsLeft.textContent =
      //   [...document.querySelectorAll(".todos .card")].length + 1;
      makenewtask(tasks);
      updateItemsLeft();
    }
  });
  filter.addEventListener("click",(e)=>{
    const id=e.target.id
    if(id){
      document.querySelector(".on").classList.remove("on")
    document.getElementById(id).classList.add("on")
    document.querySelector(".todos").className=`todos ${id}`
    }
    
  })

  btnFilters.addEventListener("click",()=>{
    let indexes=[]
    document.querySelectorAll(".card.checked").forEach((card)=>{
      indexes.push([...document.querySelectorAll(".todos .card")].indexOf(card))
      card.classList.add("fall")
      card.addEventListener("animationend",()=>{
        card.remove()
      })
    })
    removeAllCompletedTasks(indexes);
  })
  
  function removeAllCompletedTasks(indexes){
    let task=JSON.parse(localStorage.getItem("Tasks"))
    task=task.filter((todos,index)=>{
      return !indexes.includes(index)
    })
    localStorage.setItem("Tasks",JSON.stringify(task))
    
  }
  
  // make a new task html/css-------------------------------//
  function makenewtask(item) {
    // creating new elements
    const newli = document.createElement("li");
    const newDiv = document.createElement("div");
    const newInput = document.createElement("input");
    const newSpan = document.createElement("span");
    const newP = document.createElement("p");
    const newBtn = document.createElement("button");
    const newBtnClearImg = document.createElement("img");
    // add class to new elements

    newSpan.classList.add("check");
    newP.className = "item";
    newBtn.className = "clear";
    newDiv.classList.add("cb-container");
    newli.classList.add("card");
    newInput.classList.add("cb-input");
    // set attribute to new elements

    newInput.setAttribute("type", "checkbox");
    newBtnClearImg.setAttribute("src", "./assets/images/icon-cross.svg");
    newli.setAttribute("draggable", true);

    // append new element to parent

    newBtn.appendChild(newBtnClearImg);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newSpan);
    newli.appendChild(newDiv);
    newli.appendChild(newP);
    newli.appendChild(newBtn);
    list.appendChild(newli);

    newP.textContent = item.task;

    if (item.iscompleted) {
      newli.classList.add("checked");
      newInput.setAttribute("checked", "checked");
    }

    //--------------- Dragging styles
    newli.addEventListener("dragstart", () => {
      newli.classList.add("dragging");
    });
    newli.addEventListener("dragend", () => {
      newli.classList.remove("dragging");
    });

    newBtn.addEventListener("click", (e) => {
      const currentCard = newBtn.parentElement;
      currentCard.classList.add("fall");
      const listTaskIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      removeTaskInStorage(listTaskIndex);
      // itemsLeft.textContent =
      //   [...document.querySelectorAll(".todos .card")].length - 1;
      updateItemsLeft();

      currentCard.addEventListener("animationend", () => {
        setTimeout(() => {
          currentCard.remove();
          updateItemsLeft();
        }, 100);
      });
    });
    newInput.addEventListener("click", (e) => {
      const currentLi = newInput.parentElement.parentElement;
      const checked = newInput.checked;
      const currentLiIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentLi);
      statusTodo(currentLiIndex, checked);

      checked
        ? newli.classList.add("checked")
        : newli.classList.remove("checked");
      updateItemsLeft();
    });
  }
  function updateItemsLeft() {
    const remaining = document.querySelectorAll(
      ".todos .card:not(.checked)"
    ).length;
    itemsLeft.textContent = remaining;
  }

  function removeTaskInStorage(index) {
    const datastorage = JSON.parse(localStorage.getItem("Tasks"));
    datastorage.splice(index, 1);
    localStorage.setItem("Tasks", JSON.stringify(datastorage));
  }

  function statusTodo(index, iscompletedStatus) {
    const datastorage = JSON.parse(localStorage.getItem("Tasks"));
    datastorage[index].iscompleted = iscompletedStatus;
    localStorage.setItem("Tasks", JSON.stringify(datastorage));
  }

  updateItemsLeft();
}
document.addEventListener("DOMContentLoaded", main);
