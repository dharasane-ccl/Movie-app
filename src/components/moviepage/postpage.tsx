import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { render } from '@testing-library/react';

const PostPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<any[]>(`/https://jsonplaceholder.typicode.com/posts`);
        setPosts(response.data as any[]);
      } catch (err) {
        setError('Error loading posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h1>Movie Posts</h1>
      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-md-4 mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>UserId: {post.userId}</Card.Title>
                <Card.Title>ID: {post.id}</Card.Title>
                <Card.Title>Title: {post.title}</Card.Title>
                <Card.Text> Body: {post.body}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PostPage;
