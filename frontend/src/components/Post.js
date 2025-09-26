import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Post.css';

const Post = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.user === user?._id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment('');
        toast.success('Comment added successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        onPostDelete?.(post._id);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setShowMenu(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const isOwner = user?._id === post.author._id;

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.author.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.username} />
            ) : (
              <span>
                {post.author.firstName?.charAt(0)}
                {post.author.lastName?.charAt(0)}
              </span>
            )}
          </div>
          <div className="author-info">
            <h4>{post.author.firstName} {post.author.lastName}</h4>
            <span className="username">@{post.author.username}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="post-menu">
            <button 
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FiMoreHorizontal />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleDelete} className="menu-item delete">
                  <FiTrash2 size={16} />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post content" />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FiHeart />}
          <span>{likesCount}</span>
        </button>

        <button 
          className="action-btn comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle />
          <span>{comments.length}</span>
        </button>

        <button className="action-btn share-btn">
          <FiShare2 />
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <div className="comment-input-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                maxLength={160}
                rows={2}
                className="comment-input"
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Comment'}
              </button>
            </div>
            <div className="comment-count">
              {newComment.length}/160
            </div>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-author">
                  <div className="comment-avatar">
                    {comment.user.profilePicture ? (
                      <img src={comment.user.profilePicture} alt={comment.user.username} />
                    ) : (
                      <span>
                        {comment.user.firstName?.charAt(0)}
                        {comment.user.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="comment-info">
                    <span className="comment-author-name">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="comment-username">@{comment.user.username}</span>
                  </div>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;