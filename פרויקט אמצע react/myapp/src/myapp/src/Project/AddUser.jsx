import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ onSave, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = async () => {
    const newUser = { name: firstName, email: email };

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
      console.log(response);
      console.log(response.data);
      onSave(firstName, email);
    } catch (error) {
      console.error('Error adding user:', error);
    }

    setFirstName('');
    setEmail('');
  };

  return (
    <div>
      <h2>Add New User</h2>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default AddUser;
