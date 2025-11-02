import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./ExpensesPage.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpensesPage = () => {
  const [entries, setEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    entryId: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    fetchEntries();
    fetchExpenses();
  }, []);

  const fetchEntries = async () => {
    const res = await fetch("http://localhost:8080/api/entries");
    const data = await res.json();
    setEntries(data);
  };

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:8080/api/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  const addExpense = async () => {
    if (!newExpense.entryId || !newExpense.amount || !newExpense.category) {
      alert("Please fill in all fields!");
      return;
    }

    const requestBody = {
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      entry: { id: newExpense.entryId },
    };

    await fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    setNewExpense({ entryId: "", amount: "", category: "", date: "" });
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "DELETE",
    });
    fetchExpenses();
  };

  // ✅ Data grouped by Entry for the chart
  const chartData = {
    labels: entries.map((e) => e.title),
    datasets: [
      {
        label: "Total € spent",
        data: entries.map((entry) => {
          const total = expenses
            .filter((exp) => exp.entry?.id === entry.id) // ✅ correct relation check
            .reduce((sum, exp) => sum + exp.amount, 0);
          return total;
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="expenses-container">
      <h2>💰 Track Your Travel Expenses</h2>

      {/* Chart Section */}
      <div className="expenses-chart-container">
        <h3>Total Cost per Trip</h3>
        <Bar data={chartData} />
      </div>

      {/* Form */}
      <div className="expense-form">
        <select
          value={newExpense.entryId}
          onChange={(e) =>
            setNewExpense({ ...newExpense, entryId: e.target.value })
          }
        >
          <option value="">Select Entry</option>
          {entries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="€ Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) =>
            setNewExpense({ ...newExpense, category: e.target.value })
          }
        />

        <input
          type="date"
          value={newExpense.date}
          onChange={(e) =>
            setNewExpense({ ...newExpense, date: e.target.value })
          }
        />

        <button onClick={addExpense}>+ Add</button>
      </div>

      {/* List */}
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <div>
              <strong>
                {expense.entry ? expense.entry.title : "Unknown"}
              </strong>
              {"  — " + expense.category}
              {"  — €" + expense.amount}
              {"  — 📅 " + expense.date}
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteExpense(expense.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;
