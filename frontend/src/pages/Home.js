import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        if (append) {
          setPosts(prev => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(data.pagination.hasNext);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-content">
          <main className="main-content">
            <div className="feed-header">
              <h1>Home Feed</h1>
              <p>See what's happening in your network</p>
            </div>

            <CreatePost onPostCreated={handlePostCreated} />

            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-feed">
                  <h3>No posts yet</h3>
                  <p>Be the first to share something! Create a post above to get started.</p>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <Post
                      key={post._id}
                      post={post}
                      onPostDelete={handlePostDeleted}
                    />
                  ))}

                  {hasMore && (
                    <div className="load-more-container">
                      <button
                        onClick={loadMorePosts}
                        className="btn btn-outline"
                        disabled={loadingMore}
                      >
                        {loadingMore ? 'Loading...' : 'Load More Posts'}
                      </button>
                    </div>
                  )}

                  {!hasMore && posts.length > 0 && (
                    <div className="end-of-feed">
                      <p>You've reached the end of your feed!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Welcome to Mini Social!</h3>
              <p>Connect with friends, share your thoughts, and discover what's happening around you.</p>
              
              <div className="sidebar-stats">
                <div className="stat-item">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Tips</h3>
              <ul className="tips-list">
                <li>Use #hashtags to categorize your posts</li>
                <li>Mention others with @username</li>
                <li>Keep posts under 280 characters</li>
                <li>Add images with URLs to make posts engaging</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;