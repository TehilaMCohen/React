import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetailsTodos from './UserDetailsTodos';
import UserDetailsPosts from './UserDetailsPosts';

export default function UserDetailsWindow({ userId, onCompleteAllTasks }) {
  const [todos, setTodos] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch todos based on userId
        const todosResponse = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
        setTodos(todosResponse.data);

        // Fetch posts based on userId
        const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAllTasksCompleted = () => {
    console.log('All tasks completed for user:', userId);
    onCompleteAllTasks(userId);
  };
  

  return (
    <div className="user-details-window">
      <div className="user-details-todos">
        <UserDetailsTodos userId={userId} todos={todos} onCompleteAllTasks={handleAllTasksCompleted} />
      </div>
      <div className="user-details-posts">
        <UserDetailsPosts userId={userId} posts={posts} />
      </div>
    </div>
  );
}
