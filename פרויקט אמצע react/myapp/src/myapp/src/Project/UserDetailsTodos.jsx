import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDetailsTodos({ userId, todos, onCompleteAllTasks }) {
  const [userTasks, setUserTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoBody, setNewTodoBody] = useState('');
  const [nextTodoId, setNextTodoId] = useState(3); // Start with 3 since you already have 2 todos

  useEffect(() => {
    // Fetch user-specific tasks and initialize userTasks state
    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
        setUserTasks(response.data.slice(0, 2)); // Get only the first two todos
      } catch (error) {
        console.error('Error fetching user tasks:', error);
      }
    };

    fetchUserTasks();
  }, [userId]);

  const handleMarkComplete = async (todoId) => {
    console.log('Marking todo as completed:', todoId);

    const updatedUserTasks = userTasks.map((task) =>
      task.id === todoId ? { ...task, completed: true } : task
    );
    console.log('Updated User Tasks:', updatedUserTasks);
    setUserTasks(updatedUserTasks);

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${todoId}`, { completed: true });

      const allTasksCompleted = updatedUserTasks.every((task) => task.completed);
      console.log('All tasks completed:', allTasksCompleted);
      if (allTasksCompleted) {
        onCompleteAllTasks(userId);
      }
    } catch (error) {
      console.error('Error marking todo as completed:', error);
    }
  };

  const handleAddTodo = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = (e) => {
    e.preventDefault(); 
    setShowAddForm(false);
    setNewTodoTitle('');
    setNewTodoBody('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') {
      alert('Please enter a title for the new todo.');
      return;
    }

    const newTodo = {
      userId: userId,
      id: nextTodoId,
      title: `${newTodoTitle}`,
      completed: false,
    };

    try {
      await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
      setUserTasks([...userTasks, newTodo]);
      setShowAddForm(false);
      setNewTodoTitle('');
      setNewTodoBody('');
      setNextTodoId((prevId) => prevId + 1); // Increment nextTodoId for the next todo
    } catch (error) {
      console.error('Error adding new todo:', error);
    }
  };

  return (
    <div>
      <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Todos</h3>
      <button style={{ display: 'inline-block' }} onClick={handleAddTodo}>
        Add
      </button>
      {showAddForm && (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title"
            />
            <br />
            <button onClick={handleCancelAdd}>Cancel</button>
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
      {!showAddForm && (
        userTasks.map((task) => (
          <div key={task.id}>
            <p><strong>Title: </strong>{task.title}</p>
            <p><strong>Completed: </strong>{task.completed ? 'True' : 'False'}</p>
            {!task.completed && (
              <button onClick={() => handleMarkComplete(task.id)}>Mark Completed</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
