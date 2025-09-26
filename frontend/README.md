# Mini Social Media - Frontend

A modern, responsive social media frontend built with React.js.

## Features

- User authentication (login/register)
- Responsive design for all devices
- Create and share posts
- Like and comment on posts
- User profiles with editing capabilities
- Follow/unfollow users
- Real-time feed updates
- Image support via URLs
- Hashtags and mentions
- Search functionality
- Toast notifications

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Navigation
- **React Icons** - Icon components
- **React Toastify** - Toast notifications
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── CreatePost.js  # Post creation component
│   ├── Loading.js     # Loading spinner
│   ├── Navbar.js      # Navigation bar
│   └── Post.js        # Individual post component
├── contexts/          # React contexts
│   └── AuthContext.js # Authentication context
├── pages/             # Page components
│   ├── Auth.css       # Authentication styles
│   ├── Home.js        # Home feed page
│   ├── Login.js       # Login page
│   ├── Profile.js     # User profile page
│   ├── Register.js    # Registration page
│   └── UserProfile.js # Other user profiles
├── App.js             # Main app component
├── index.js           # Entry point
└── index.css          # Global styles
```

## Features Overview

### Authentication
- **Login/Register**: Secure authentication with JWT tokens
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users
- **Persistent Sessions**: Stay logged in across browser sessions

### Posts
- **Create Posts**: Write posts up to 280 characters
- **Image Support**: Add images via URLs
- **Interactions**: Like, comment, and share posts
- **Real-time Updates**: See new posts without refreshing

### User Profiles
- **Profile Management**: Edit name, username, and bio
- **User Statistics**: View post count, followers, and following
- **Profile Pictures**: Avatar with initials fallback

### Social Features
- **Follow System**: Follow/unfollow other users
- **Personalized Feed**: See posts from followed users
- **User Discovery**: Find and connect with other users

### Design
- **Responsive**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface
- **Accessibility**: Keyboard navigation and screen reader support
- **Toast Notifications**: Instant feedback for user actions

## Customization

### Styling
The app uses CSS modules and custom properties for easy theming. Main colors and styles can be modified in `index.css`.

### Components
All components are modular and can be easily customized or replaced:
- `CreatePost` - Post creation form
- `Post` - Individual post display
- `Navbar` - Navigation component
- `Loading` - Loading states

### Pages
- `Home` - Main feed with post creation
- `Profile` - Current user profile with editing
- `UserProfile` - Other user profiles with follow button
- `Login/Register` - Authentication forms

## API Integration

The frontend communicates with the backend API using fetch API. All API calls are handled in:
- Authentication context for user management
- Individual components for specific features
- Error handling with toast notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- ES6+ JavaScript
- Functional components with hooks
- Context API for state management
- CSS modules for styling

### Best Practices
- Component reusability
- Error boundary handling
- Optimistic UI updates
- Responsive design patterns

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## License

MIT License