import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetailsWindow from './UserDetailsWindow'; // Import UserDetailsWindow
import AddUser from './AddUser'; // Import AddUser component

const urlUser = 'https://jsonplaceholder.typicode.com/users';
const urlTodo = 'https://jsonplaceholder.typicode.com/todos';


export default function Index() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDetailsWindow, setShowUserDetailsWindow] = useState(false);
  const [selectedUserIdForWindow, setSelectedUserIdForWindow] = useState(null);
  const [selectedDivId, setSelectedDivId] = useState(null);
  const [showAddUserWindow, setShowAddUserWindow] = useState(false);
  const [userTasks, setUserTasks] = useState({});


  const handleCompleteAllTasks = (userId) => {
    console.log('Completing all tasks for user:', userId);
    const updatedUserTasks = { ...userTasks };
    updatedUserTasks[userId] = true;
    setUserTasks(updatedUserTasks);
  };
  
  const hasUncompletedTasks = (userId) => {
    const userTaskList = Array.isArray(userTasks[userId]) ? userTasks[userId] : [];
    return userTaskList.some((task) => !task.completed);
  };
  

    useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUsers = await axios.get(urlUser);
        setUsers(responseUsers.data);

        const responseTodos = await axios.get(urlTodo);
        const todos = responseTodos.data;

        // Initialize userTasks with two tasks for each user
        const initialUserTasks = {};
        responseUsers.data.forEach((user) => {
          const userTodos = todos.filter((todo) => todo.userId === user.id).slice(0, 2);
          initialUserTasks[user.id] = userTodos;
        });
        setUserTasks(initialUserTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  


  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMoreDetails = (userId) => {
    setSelectedUserId(userId);
  };

  const closeDetails = () => {
    setSelectedUserId(null);
  };

  const updateUser = async (userId, newName, newEmail) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, name: newName, email: newEmail } : user
    );
    setUsers(updatedUsers);

    // Update data in the API
    try {
      const response= await axios.put(`${urlUser}/${userId}`, { name: newName, email: newEmail });
      console.log(response)
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);

    // Delete data from the API
    try {
      await axios.delete(`${urlUser}/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserDetailsWindow = (userId) => {
    if (selectedUserIdForWindow === userId && showUserDetailsWindow) {
      setShowUserDetailsWindow(false);
      setSelectedUserIdForWindow(null);
      if (selectedDivId === userId) {
        setSelectedDivId(null);
      }
    } else {
      setSelectedUserIdForWindow(userId);
      setShowUserDetailsWindow(true);
      setSelectedDivId(userId);
    }
  };

  const handleAddUserClick = () => {
    setShowAddUserWindow(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUserWindow(false);
  };

  const handleSaveNewUser = async (firstName, email) => {
    const newUser = {
      id: users.length + 1, // Generate a new ID for the user
      name: firstName,
      email: email,
    };
    setUsers([...users, newUser]);
    setShowAddUserWindow(false);

    // Add data to the API
    try {
      await axios.post(urlUser, newUser);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleAddUserClick}>ADD</button> {/* Updated ADD button */}
        {filteredUsers.map((userData) => (
  <div
  key={userData.id}
  style={{
    border: userTasks[userData.id] && hasUncompletedTasks(userData.id) ? '1px solid red' : '1px solid green',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: showUserDetailsWindow && selectedUserIdForWindow === userData.id ? 'orange' : 'transparent',
  }}
>

    <span
      onClick={() => {
        toggleUserDetailsWindow(userData.id);
        setSelectedDivId(userData.id);
      }}
    >
      ID: {userData.id}
    </span>
    <br />
    Name: <input type="text" value={userData.name} onChange={(e) => updateUser(userData.id, e.target.value, userData.email)} />
    <br />
    Email: <input type="email" value={userData.email} onChange={(e) => updateUser(userData.id, userData.name, e.target.value)} />
    <br />
    <button onMouseOver={() => toggleMoreDetails(userData.id)} onClick={closeDetails}>
      Other Data
    </button>
    <button onClick={() => updateUser(userData.id, userData.name, userData.email)}>Update</button>
    <button onClick={() => deleteUser(userData.id)}>Delete</button>
    <br />
    {selectedUserId === userData.id && (
      <div>
        <h3>Additional Details:</h3>
        <p>Street: {userData.address?.street}</p>
        <p>Zip Code: {userData.address?.zipcode}</p>
        <p>City: {userData.address?.city}</p>
      </div>
    )}
  </div>
))}

    
      </div>

      {showUserDetailsWindow && (
        <div style={{ width: '30%', marginLeft: '20px' }}>
<UserDetailsWindow
  userId={selectedUserIdForWindow}
  userTasks={userTasks} // Assuming userTasks is defined in your parent component's state
  setUserTasks={setUserTasks} // Assuming setUserTasks is a state update function
  onCompleteAllTasks={handleCompleteAllTasks} // Assuming handleCompleteAllTasks is defined
/>
        </div>
      )}

      {/* New AddUser Window */}
      {showAddUserWindow && (
        <div style={{ width: '30%', marginLeft: '20px' }}>
          <AddUser onSave={handleSaveNewUser} onCancel={handleCancelAddUser} />
        </div>
      )}
    </div>
  );
}
