import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDetailsPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        setPosts(response.data.slice(0, 2)); // Get only the first two posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleAddPost = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = (e) => {
    e.preventDefault(); // Prevent default form submission
    setShowAddForm(false);
    setNewPostTitle('');
    setNewPostBody('');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPostTitle.trim() === '' || newPostBody.trim() === '') {
      alert('Please enter a title and body for the new post.');
      return;
    }
    const newPost = {
      userId: userId,
      title: newPostTitle,
      body: newPostBody,
    };
    try {
      const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, newPost);
      setPosts([...posts, response.data]);
      setShowAddForm(false);
      setNewPostTitle('');
      setNewPostBody('');

      // Log the response to the console
      console.log(response); // Fix the typo here

      // Alternatively, you can use console.log(response.data) if you want to log just the data

    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div>
      <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Posts</h3>
      <button style={{ display: 'inline-block' }} onClick={handleAddPost}>
        Add
      </button>
      {showAddForm && (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Enter post title"
            />
            <br />
            <textarea
              value={newPostBody}
              onChange={(e) => setNewPostBody(e.target.value)}
              placeholder="Enter post body"
            />
            <br />
            <button onClick={handleCancelAdd}>Cancel</button>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
      {!showAddForm && (
        posts.map((post) => (
          <div key={post.id}>
            <p><strong>Title: </strong>{post.title}</p>
            <p><strong>Body: </strong>{post.body}</p>
          </div>
        ))
      )}
    </div>
  );
}
