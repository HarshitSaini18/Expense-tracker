const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const homeScreen = document.getElementById("home-screen");
const mainScreen = document.getElementById("main-screen");
const transactionList = document.getElementById("transaction-list");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const deleteBtn = document.getElementById("delete-btn");
const infoContainer = document.getElementById("info-container");
const addBtn = document.getElementById("add-btn");
const descInput = document.getElementById("desc-input");
const amountInput = document.getElementById("amount-input");

// variables
let transacList = JSON.parse(localStorage.getItem("transacList") || "[]");
// event adders
addBtn.addEventListener("click", addTransactions);

// functions

function updateBalance() {
  const finalincome = JSON.parse(localStorage.getItem("income") || "0");
  const finalexpense = JSON.parse(localStorage.getItem("expense") || "0");
  const finalbalance = JSON.parse(localStorage.getItem("balance") || "0");
  income.textContent = (+finalincome).toFixed(2);
  expense.textContent = (+finalexpense).toFixed(2);
  balance.textContent = (+finalbalance).toFixed(2);
  // balance.textContent =0;
  // income.textContent = 0;
  // expense.textContent = 0;
}

window.onload = function () {
  transacList = JSON.parse(localStorage.getItem("transacList") || "[]");

  updateBalance();

  if (transacList.length > 0) {
    homeScreen.classList.remove("active");
    mainScreen.classList.add("active");
  }

  transacList.forEach((transacObj) => createListItem(transacObj));
};

function deleteTransactions(transacObjId, transacObjAmount) {
  if (transacObjAmount >= 0) {
    income.textContent = (+income.textContent - +transacObjAmount).toFixed(2);
  } else {
    expense.textContent = (+expense.textContent + +transacObjAmount).toFixed(2);
  }
  balance.textContent = (+income.textContent - +expense.textContent).toFixed(2);

  localStorage.setItem(
    "income",
    JSON.stringify((+income.textContent).toFixed(2))
  );
  localStorage.setItem(
    "expense",
    JSON.stringify((+expense.textContent).toFixed(2))
  );
  localStorage.setItem(
    "balance",
    JSON.stringify((+balance.textContent).toFixed(2))
  );

  transacList = transacList.filter(
    (transacObj) => transacObj.id !== transacObjId
  );
  localStorage.setItem("transacList", JSON.stringify(transacList));
}

function addTransactions() {
  homeScreen.classList.remove("active");
  mainScreen.classList.add("active");

  const amount = +amountInput.value;
  const description = descInput.value.trim();

  if (amount >= 0 && description != "") {
    income.textContent = (+income.textContent + amount).toFixed(2);
  } else if (description != "") {
    expense.textContent = (+expense.textContent + Math.abs(amount)).toFixed(2);
  }

  localStorage.setItem(
    "income",
    JSON.stringify((+income.textContent).toFixed(2))
  );
  localStorage.setItem(
    "expense",
    JSON.stringify((+expense.textContent).toFixed(2))
  );

  balance.textContent = (+income.textContent - +expense.textContent).toFixed(2);

  localStorage.setItem(
    "balance",
    JSON.stringify((+balance.textContent).toFixed(2))
  );

  const transacObj = {
    desc: description,
    amount: amount,
    id: Date.now(),
  };
  transacList = JSON.parse(localStorage.getItem("transacList") || "[]");
  transacList.push(transacObj);
  localStorage.setItem("transacList", JSON.stringify(transacList));
  createListItem(transacObj);

  amountInput.value = "";
  descInput.value = "";
}



function createListItem(transacObj) {
  const li = document.createElement("li");
  li.classList.add("list");
  li.classList.add("transaction-item");

  const leftdiv = document.createElement("div");
  leftdiv.classList.add("left-li");

  const rightdiv = document.createElement("div");
  rightdiv.classList.add("right-li");
  rightdiv.textContent = transacObj.amount;
  if (transacObj.amount >= 0) {
    rightdiv.innerHTML = `&#8377;`;
  } else {
    rightdiv.innerHTML = "-" + `&#8377;`;
  }

  const descSpan = document.createElement("span");
  descSpan.classList.add("desc");
  descSpan.textContent = transacObj.desc;

  const amountSpan = document.createElement("span");
  amountSpan.classList.add("amount");
  amountSpan.textContent = Math.abs(transacObj.amount);

  const cloneDeleteBtn = document.createElement("button");
  cloneDeleteBtn.classList.add("delete-btn");
  cloneDeleteBtn.classList.add("hidden");
  cloneDeleteBtn.innerHTML = `&times;`;
  cloneDeleteBtn.addEventListener("click", () => {
    deleteTransactions(transacObj.id, transacObj.amount);
    li.remove();
  });

  leftdiv.appendChild(descSpan);
  rightdiv.appendChild(amountSpan);
  rightdiv.appendChild(cloneDeleteBtn);
  li.appendChild(leftdiv);
  li.appendChild(rightdiv);

  li.addEventListener("mouseover",() =>{
    showDelete(cloneDeleteBtn)});
  li.addEventListener("mouseout",() => {hideDelete(cloneDeleteBtn)});


  if (transacObj.amount >= 0) {
    li.classList.add("income-list");
  } else {
    li.classList.add("expense-list");
  }

  transactionList.insertBefore(li,transactionList.firstChild);
  setTimeout(() => {
    li.classList.add("show");
  },10);
}

function hideDelete(cloneDeleteBtn){
  cloneDeleteBtn.classList.add("hidden");
  cloneDeleteBtn.classList.remove("shown");
}

function showDelete(cloneDeleteBtn){
  cloneDeleteBtn.classList.add("shown");
  cloneDeleteBtn.classList.remove("hidden")
}
