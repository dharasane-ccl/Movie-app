import { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/user/login';
import MovieViewPage from './components/moviepage/movie';
import Sidebar from './components/moviepage/sidebar';
import Lists from './components/moviepage/movie-list';
import { User, Movie } from './components/user/types';
import AdminPanel from './components/adminpanel/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostPage from './components/moviepage/postpage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [movies, setMovies] = useState<Movie[]>([]);

  

  const favoriteMovies = useMemo(
  () => movies.filter((m) => m.isFavorite),
  [movies]
);

   useEffect(() => {
    const localFavorites = localStorage.getItem('favoriteMovies');
    let initialMovies = Lists.map((m) => ({ ...m, isFavorite: false }));
    if (localFavorites) {
      const favoriteIds = JSON.parse(localFavorites);
      initialMovies = Lists.map((m) => ({ ...m, isFavorite: favoriteIds.includes(m._id) }));
    }
    setMovies(initialMovies);
  }, []);
  useEffect(() => {
    const favoriteIds = movies.filter((m) => m.isFavorite).map((m) => m._id);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteIds));
  }, [movies]);

//  useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn) {
//       setIsAuthenticated(true);
//     }
//   }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleFavorite = useCallback((id: string) => {
    let movieTitle = '';
    let wasFavorite: boolean = false;

    setMovies((prev) => {
      const movieToUpdate = prev.find(movie => movie._id === id);
      if (movieToUpdate) {
        movieTitle = movieToUpdate.title;
        wasFavorite = movieToUpdate.isFavorite;
      }
      return prev.map((movie) =>
        movie._id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
      );
    });

    if (wasFavorite) {
      toast.success(`Movie "${movieTitle}" removed from favorites.`, { position: "top-right", className: "bg-success text-white" });
    } else {
      toast.success(`Movie "${movieTitle}" added to favorites!`, { position: "top-right", className: "bg-success text-white" });
    }
  }, []);
  const handleLogout =useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('You have been logged out successfully!', { position: "top-right", className: "bg-success text-white" });
    navigate('/login', { replace: true });
  },[navigate]);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/movie" /> : <Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/movie" replace />
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          )
        }
      />
      <Route
        path="/movie"
        element={
          isAuthenticated && user ? ( 
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={user} 
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
                  user={user}
                  movielists={movies}
                  favoriteMovies={favoriteMovies}
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
          isAuthenticated && user ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={user}
              />
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0', transition: 'margin-left 0.3s ease' }}>
                <MovieViewPage
                  user={user}
                  movielists={favoriteMovies}
                  favoriteMovies={favoriteMovies}
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
        path="/posts"
        element={
          isAuthenticated && user ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={user}
              />
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0', transition: 'margin-left 0.3s ease' }}>
                <PostPage />
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
          isAuthenticated && user?.id === 1 ? (
            <>
              <Sidebar
                onLogout={handleLogout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={user}
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
              <div style={{ marginLeft: sidebarOpen ? '210px' : '0' }}>
                <AdminPanel />
              </div>
            </>
          ) : (
            <Navigate to="/movie" />
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
