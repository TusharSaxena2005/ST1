import React, { useState, useRef } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setContent('');
        setSelectedFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success('Post created successfully!');
        onPostCreated?.(data.post);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} />
          ) : (
            <span>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="username">@{user?.username}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={280}
          rows={3}
          className="post-textarea"
          disabled={isSubmitting}
        />

        <div className="character-count">
          <span className={content.length > 250 ? 'text-danger' : ''}>
            {content.length}/280
          </span>
        </div>

        <div className="image-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div className="image-actions">
            <button
              type="button"
              onClick={triggerFileInput}
              className="image-upload-btn"
              disabled={isSubmitting}
            >
              <FiImage size={18} />
              {selectedFile ? 'Change Image' : 'Add Image'}
            </button>
            
            {selectedFile && (
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
                disabled={isSubmitting}
              >
                <FiX size={16} />
                Remove
              </button>
            )}
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <div className="image-info">
                <span className="file-name">{selectedFile?.name}</span>
                <span className="file-size">
                  {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="create-post-actions">
          <div className="post-info">
            <span className="hashtag-info">
              Use #hashtags and @mentions to connect with others
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;