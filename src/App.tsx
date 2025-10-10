import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/user/login';
import MovieViewPage from './components/moviepage/movie';
import Sidebar from './components/moviepage/sidebar';
import Lists from './components/moviepage/movie-list';
import { User, Movie } from './components/user/types';
import AdminPanel from './components/adminpanel/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const localFavorites = localStorage.getItem('favoriteMovies');
    if (localFavorites) {
      const favoriteIds = JSON.parse(localFavorites);
      return Lists.map((m) => ({ ...m, isFavorite: favoriteIds.includes(m._id) }));
    }
    return Lists.map((m) => ({ ...m, isFavorite: false }));
  });

  useEffect(() => {
    const favoriteIds = movies.filter((m) => m.isFavorite).map((m) => m._id);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteIds));
  }, [movies]); 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleFavorite = (id: string) => {
    let movieTitle = '';
    let wasFavorite: boolean = false;

    const movieToUpdate = movies.find(movie => movie._id === id);


    if (movieToUpdate) {
      movieTitle = movieToUpdate.title;
      wasFavorite = movieToUpdate.isFavorite;

      setMovies((prev) =>
        prev.map((movie) =>
          movie._id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
        )
      );

      if (wasFavorite) {
        toast.success(`Movie "${movieTitle}" removed from favorites.`, { position: "top-right", className: "bg-success text-white" });
      } else {
        toast.success(`Movie "${movieTitle}" added to favorites!`, { position: "top-right", className: "bg-success text-white" });
      }
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    toast.success('You have been logged out successfully!', { position: "top-right", className: "bg-success text-white" });
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/movie" /> : <Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/movie" replace />
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setCurrentUser} />
          )
        }
      />
      <Route
        path="/movie"
        element={
          isAuthenticated && currentUser ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={currentUser}
              />
              {sidebarOpen && (
                <div
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1020,
                    cursor: 'pointer',
                  }}
                />
              )}
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0', transition: 'margin-left 0.3s ease' }}>
                <MovieViewPage
                  user={currentUser}
                  movielists={movies}
                  favoriteMovies={movies.filter((m) => m.isFavorite)}
                  onToggleFavorite={handleToggleFavorite}
                  onLogout={handleLogout}
                  isFavoritesPage={false}
                  pageTitle={'Movies'} />
              </div>
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/movie/favorites"
        element={
          isAuthenticated && currentUser ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={currentUser}
              />
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0', transition: 'margin-left 0.3s ease' }}>
                <MovieViewPage
                  user={currentUser}
                  movielists={movies.filter((m) => m.isFavorite)}
                  favoriteMovies={movies.filter((m) => m.isFavorite)}
                  onToggleFavorite={handleToggleFavorite}
                  onLogout={handleLogout}
                  isFavoritesPage={false}
                  pageTitle="Favorites"
                />
              </div>
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated && currentUser?.type === 1 ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={currentUser}
              />
              {sidebarOpen && (
                <div
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1020,
                    cursor: 'pointer',
                  }}
                />
              )}
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0', transition: 'margin-left 0.3s ease' }}>
                <AdminPanel />
              </div>
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </BrowserRouter>
);

export default AppWithRouter;
