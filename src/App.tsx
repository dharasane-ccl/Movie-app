import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/user/login';
import MovieViewPage from './components/moviepage/movie';
import Sidebar from './components/moviepage/sidebar';
import Lists from './components/moviepage/movie-list';
import { User, Movie } from './components/user/types';
import AdminPanel from './components/adminpanel/admin';

const LOCAL_STORAGE_KEY = 'masterMovieList';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';                          
  });
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

  const [showFavorites, setShowFavorites] = useState(false);
  const [showMasterMovies, setShowMasterMovies] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setShowMasterMovies(false); 
  };

  const handleShowAllMovies = () => {
    setShowFavorites(false);
    setShowMasterMovies(false); 
  };

  const handleShowMasterMovies = () => {
    setShowMasterMovies(true);
  };

  const handleToggleFavorite = (id: string) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie._id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
      )
    );
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/movie" /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/movie" replace />
            ) : (
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUser={setCurrentUser}
              />
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
                  onShowFavorites={handleShowFavorites}
                  onShowAllMovies={handleShowAllMovies}
                  onShowMasterMovies={handleShowMasterMovies} 
                  showFavorites={showFavorites}
                  showMasterMovies={showMasterMovies} 
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
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      cursor: 'pointer',
                    }}
                  />
                )}
                <div
                  style={{
                    marginLeft: sidebarOpen ? '210px' : '0',
                    transition: 'margin-left 0.3s ease',
                  }}
                >
                  {currentUser.type === 1 && showMasterMovies ? (
                    <AdminPanel />
                  ) : (
                    <MovieViewPage
                      user={currentUser}
                      movielists={showFavorites ? movies.filter((m) => m.isFavorite) : movies}
                      favoriteMovies={movies.filter((m) => m.isFavorite)}
                      onToggleFavorite={handleToggleFavorite}
                      onLogout={handleLogout}
                    />
                  )}
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
                  onShowFavorites={handleShowFavorites}
                  onShowAllMovies={handleShowAllMovies}
                  onShowMasterMovies={handleShowMasterMovies}
                  showFavorites={showFavorites}
                  showMasterMovies={showMasterMovies}
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
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      cursor: 'pointer',
                    }}
                  />
                )}
                <div
                  style={{
                    marginLeft: sidebarOpen ? '210px' : '0',
                    transition: 'margin-left 0.3s ease',
                  }}
                >
                  {showMasterMovies ? (
                    <AdminPanel />
                  ) : (
                    <MovieViewPage
                      user={currentUser}
                      movielists={showFavorites ? movies.filter((m) => m.isFavorite) : movies}
                      favoriteMovies={movies.filter((m) => m.isFavorite)}
                      onToggleFavorite={handleToggleFavorite}
                      onLogout={handleLogout}
                    />
                  )}
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
