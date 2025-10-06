
import React, { useEffect, useRef } from 'react';
import { User } from '../user/types';

interface SidebarProps {
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onShowFavorites: () => void;
  onShowAllMovies: () => void;
  onShowMasterMovies: () => void; 
  showFavorites: boolean;
  showMasterMovies: boolean; 
  currentUser: User | null; 
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onShowFavorites,
  onShowAllMovies,
  onShowMasterMovies,
  showFavorites,
  showMasterMovies,
  currentUser,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const commonButtons = (
    <>
      <button
        onClick={onShowAllMovies}
        className={`nav-link text-black mb-2 my-3 p-3 ${!showFavorites && !showMasterMovies ? 'bg-success text-white' : 'bg-white'
          }`}
      >
        All Movies
      </button>

      <button
        onClick={onShowFavorites}
        className={`nav-link text-black mb-2 my-3 p-3 ${showFavorites && !showMasterMovies ? 'bg-success text-white' : 'bg-white'
          }`}
      >
        Favorite Movie
      </button>
    </>
  );
  return (
    <>
      <nav className="navbar navbar-light bg-white shadow d-xxl-none">
        <div className="container ">
          <button
            className="btn btn-success"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <span className="navbar-brand ms-2 mb-0 h1">Movies</span>
        </div>
      </nav>

      <div
        ref={sidebarRef}
        className={`bg-white shadow vh-100 p-3 position-fixed top-0 start-0 overflow-auto ${sidebarOpen ? 'd-block' : 'd-none'} d-xxl-block`}
        style={{ width: '210px', zIndex: 1030 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="d-flex align-items-center mb-4">
          <img src="assets/logo.png" alt="Just Watch Logo" className="me-2" />
          <span className="fw-bold fs-4">Just Watch</span>
        </div>

        {commonButtons}
        {currentUser?.type === 1 && (
          <button
            onClick={onShowMasterMovies}
            className={`nav-link text-black mb-2 my-3 p-3 ${showMasterMovies ? 'bg-success text-white' : 'bg-white'


              }`}
          >
            Master Movies
          </button>
        )}
      </div>
    </>
  );
};
export default Sidebar;
