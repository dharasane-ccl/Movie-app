import React, { useEffect, useRef } from 'react';
import { User } from '../user/types';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentUser,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  const commonLinks = (
    <>
      <Link
        to="/movie"
        className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/movie' ? 'bg-success text-white' : 'bg-white'}`}
        onClick={() => setSidebarOpen(false)}
      >
        All Movies
      </Link>
      <Link
        to="/movie/favorites"
        className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/movie/favorites' ? 'bg-success text-white' : 'bg-white'}`}
        onClick={() => setSidebarOpen(false)}
      >
        Favorite Movies
      </Link>
    </>
  );
  return (
    <>
      <nav className="navbar navbar-light d-xxl-none">
        <div className="container">
          <button
            className="btn btn-white"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
      </nav>
      <div
        ref={sidebarRef}
        className={`bg-white shadow vh-100 p-3 position-fixed top-0 start-0 ${sidebarOpen ? 'd-block' : 'd-none'} d-xxl-block`}
        style={{ width: '210px', zIndex: 1030 }}
      >
        <div className="d-flex align-items-center mb-4">
          <img src="assets/logo.png" alt="Just Watch Logo" className="me-2" />
          <span className="fw-bold fs-4">Just Watch</span>
        </div>
        {commonLinks}
        {currentUser?.type === 1 && (
          <Link
            to="/admin"
            className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/admin' ? 'bg-success text-white' : 'bg-white'}`}
            onClick={() => setSidebarOpen(false)}
          >
            Master Movies
          </Link>
        )}
      </div>
    </>
  );
};
export default Sidebar;
