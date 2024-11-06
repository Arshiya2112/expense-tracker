
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountele = document.getElementById("Total-Amount");
const clearAllButton = document.getElementById('clear-all');
const searchInput = document.getElementById('search');
const expenseNameInput = document.getElementById("expense");
const expenseAmountInput = document.getElementById("amount");
const expenseCategoryInput = document.getElementById("category");
const expenseDateInput = document.getElementById("date");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function renderExpenses() {
  expenseList.innerHTML = "";
  let totalAmount = 0;
  expenses.forEach((expense, i) => {
    const expenseRow = document.createElement("tr");
    expenseRow.innerHTML = `
        <td>${expense.name}</td>
        <td>Rs${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td class="edit-btn" data-id="${i}">Edit</td>
        <td class="delete-btn" data-id="${i}">Delete</td>`;
    expenseList.appendChild(expenseRow);
    totalAmount += expense.amount;
  });
  totalAmountele.textContent = totalAmount.toFixed(2);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  calculateMonthlyTotal();
}

function addExpense(event) {
  event.preventDefault();
  const expenseName = expenseNameInput.value;
  const expenseAmount = parseFloat(expenseAmountInput.value);
  const expenseCategory = expenseCategoryInput.value;
  const expenseDate = expenseDateInput.value;

  if (expenseName === "" || isNaN(expenseAmount)) {
    alert("Please enter valid expense details");
    return;
  }
  const expense = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
    date: expenseDate
  };

  expenses.push(expense);
  renderExpenses();
}

function deleteExpense(event) {
  if (event.target.classList.contains("delete-btn")) {
    const expenseIndex = parseInt(event.target.getAttribute("data-id"));
    expenses.splice(expenseIndex, 1);
    renderExpenses();
  }
}

function editExpense(event) {
  if (event.target.classList.contains("edit-btn")) {
    const expenseIndex = parseInt(event.target.getAttribute("data-id"));
    const expenseToEdit = expenses[expenseIndex];
    expenseNameInput.value = expenseToEdit.name;
    expenseAmountInput.value = expenseToEdit.amount;
    expenseCategoryInput.value = expenseToEdit.category;
    expenseDateInput.value = expenseToEdit.date;
    expenses.splice(expenseIndex, 1);
    renderExpenses();
  }
}

function filterExpenses() {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchQuery) || 
    expense.category.toLowerCase().includes(searchQuery)
  );
  renderFilteredExpenses(filteredExpenses);
}

function renderFilteredExpenses(filteredExpenses) {
  expenseList.innerHTML = "";
  let totalAmount = 0;
  filteredExpenses.forEach((expense, i) => {
    const expenseRow = document.createElement("tr");
    expenseRow.innerHTML = `
        <td>${expense.name}</td>
        <td>Rs${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td class="edit-btn" data-id="${i}">Edit</td>
        <td class="delete-btn" data-id="${i}">Delete</td>`;
    expenseList.appendChild(expenseRow);
    totalAmount += expense.amount;
  });
  totalAmountele.textContent = totalAmount.toFixed(2);
}

function calculateMonthlyTotal() {
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth;
  });
  let monthlyTotal = 0;
  monthlyExpenses.forEach(expense => {
    monthlyTotal += expense.amount;
  });
  document.getElementById("monthly-total").textContent = `Monthly Total: Rs${monthlyTotal.toFixed(2)}`;
}

clearAllButton.addEventListener('click', () => {
  expenses = [];
  renderExpenses();
});

expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", deleteExpense);
expenseList.addEventListener("click", editExpense);
searchInput.addEventListener("input", filterExpenses);

renderExpenses();
