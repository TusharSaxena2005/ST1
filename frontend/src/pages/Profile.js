import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FiEdit3, FiCalendar, FiUsers } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    username: user?.username || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userStats, setUserStats] = useState({
    postCount: 0,
    followerCount: 0,
    followingCount: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/posts/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        toast.error('Failed to fetch your posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats({
          postCount: data.user.postCount || 0,
          followerCount: data.user.followerCount || 0,
          followingCount: data.user.followingCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          errorData.errors.forEach(error => toast.error(error.msg));
        } else {
          toast.error(errorData.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    setUserStats(prev => ({ ...prev, postCount: prev.postCount - 1 }));
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

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-cover">
              <div className="profile-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} />
                ) : (
                  <span className="avatar-initials">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-details">
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          placeholder="First Name"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          placeholder="Last Name"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Username"
                        className="form-input"
                        required
                        minLength={3}
                        maxLength={20}
                      />
                    </div>

                    <div className="form-group">
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Bio"
                        className="form-textarea"
                        maxLength={160}
                        rows={3}
                      />
                      <small className="form-text">{editForm.bio.length}/160</small>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="btn btn-secondary"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="name-section">
                      <h1>{user?.firstName} {user?.lastName}</h1>
                      <p className="username">@{user?.username}</p>
                    </div>

                    {user?.bio && (
                      <p className="bio">{user.bio}</p>
                    )}

                    <div className="profile-meta">
                      <div className="meta-item">
                        <FiCalendar size={16} />
                        <span>Joined {formatDate(user?.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline edit-profile-btn"
                    >
                      <FiEdit3 size={16} />
                      Edit Profile
                    </button>
                  </>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{userStats.postCount}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{userStats.followerCount}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{userStats.followingCount}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-posts">
            <div className="posts-header">
              <h2>Your Posts</h2>
              <p>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-posts">
                  <h3>No posts yet</h3>
                  <p>You haven't posted anything yet. Share your first post from the home page!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    onPostDelete={handlePostDeleted}
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

export default Profile;