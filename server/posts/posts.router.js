const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios').default;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts(req.query);
    const postsWithImages = await Promise.all(
      posts.map(async post => {
        const { data: photos } = await axios.get(
          `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
        );
        
        const userInfo = await fetchUserById(post.id > 10 ? 10 : post.id);

        return {
          ...post,
          images: photos.slice(0, 3).map(photo => ({ url: photo.url })),
          userInfo,
        };
      }),
    );
    res.json(postsWithImages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Failed to fetch posts or photos or userInfo' });
  }
});

module.exports = router;
