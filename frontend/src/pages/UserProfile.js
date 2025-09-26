import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FiCalendar, FiUserPlus, FiUserMinus } from 'react-icons/fi';
import './Profile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Check if current user is following this user
        const isFollowingUser = data.user.followers?.some(
          follower => follower._id === currentUser?._id
        );
        setIsFollowing(isFollowingUser);
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${userId}`);

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        toast.error('Failed to fetch user posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch user posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        
        // Update follower count
        setUser(prev => ({
          ...prev,
          followerCount: data.followerCount
        }));

        toast.success(data.message);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to follow/unfollow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow/unfollow user');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="container">
          <div className="profile-content">
            <div className="empty-posts">
              <h3>User not found</h3>
              <p>The user you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-cover">
              <div className="profile-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} />
                ) : (
                  <span className="avatar-initials">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-details">
                <div className="name-section">
                  <h1>{user.firstName} {user.lastName}</h1>
                  <p className="username">@{user.username}</p>
                </div>

                {user.bio && (
                  <p className="bio">{user.bio}</p>
                )}

                <div className="profile-meta">
                  <div className="meta-item">
                    <FiCalendar size={16} />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'} follow-btn`}
                    disabled={isFollowLoading}
                  >
                    {isFollowLoading ? (
                      'Loading...'
                    ) : isFollowing ? (
                      <>
                        <FiUserMinus size={16} />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={16} />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{user.postCount || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.followerCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-posts">
            <div className="posts-header">
              <h2>{isOwnProfile ? 'Your Posts' : `${user.firstName}'s Posts`}</h2>
              <p>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-posts">
                  <h3>No posts yet</h3>
                  <p>
                    {isOwnProfile 
                      ? "You haven't posted anything yet. Share your first post from the home page!"
                      : `${user.firstName} hasn't posted anything yet.`
                    }
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;