import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [search, setSearch] = useState('');
  const [showInputBox, setShowInputBox] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then((res) => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      axios
        .post('http://localhost:5000/tasks', { name: newTask, completed: false })
        .then((res) => setTasks([...tasks, res.data]));
      setNewTask('');
      setShowInputBox(false);
    }
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)));
  };

  const markAsDone = (id) => {
    const task = tasks.find((t) => t._id === id);
    axios
      .put(`http://localhost:5000/tasks/${id}`, {
        ...task,
        completed: !task.completed,
      })
      .then((res) => setTasks(tasks.map((t) => (t._id === id ? res.data : t))));
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Things to do:</h1>
      <div className="input-group">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search a task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /><div className="">
          <span className="search-icon" >🔍</span></div>
        </div>
        <button onClick={() => setShowInputBox(!showInputBox)}>
          {showInputBox ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showInputBox && (
        <div className="task-input">
          <input
            type="text"
            placeholder="Enter new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask} className="button1">Add Task</button>
        </div>
      )}

      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            {task.name}
            <div>
              <button onClick={() => markAsDone(task._id)}>✔️</button>
              <button onClick={() => deleteTask(task._id) }>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
