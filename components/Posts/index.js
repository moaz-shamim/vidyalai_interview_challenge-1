import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import WindowWidthContext from '../context/windowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [smallDeviceNumberofPost, setSmallDeviceNumberofPost] = useState(20);
  const [largeDeviceNumberofPost, setLargeDeviceNumberofPost] = useState(40);
  const [currentPage, setCurrentPage] = useState(1);

  const { isSmallerDevice } = useContext(WindowWidthContext);

  const fetchPost = async (start, limit) => {
    const { data: newPosts } = await axios.get('/api/v1/posts', {
      params: { start, limit },
    });
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPost = async (start, limit) => {
      const { data: posts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });
      setPosts(posts);
    };
    fetchPost(0, isSmallerDevice ? 10 : 20);
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    const start = (nextPage - 1) * (isSmallerDevice ? 10 : 20);
    const limit = isSmallerDevice ? 10 : 20;
    fetchPost(start, limit);

    if (isSmallerDevice) {
      setSmallDeviceNumberofPost(prev => prev + 10);
    } else {
      setLargeDeviceNumberofPost(prev => prev + 20);
    }
  };

  const shouldHideButton =
    smallDeviceNumberofPost > 100 || largeDeviceNumberofPost > 100;

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post post={post} />
        ))}
      </PostListContainer>

      {!shouldHideButton && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
