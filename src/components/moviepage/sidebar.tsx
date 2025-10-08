import React, { useEffect, useRef } from 'react';
import { User } from '../user/types';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { relative } from 'path';

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
      const navbarButton = document.querySelector('.btn-white');
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        navbarButton &&
        !navbarButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const commonLinks = (
    <>
      <Link
        to="/movie"
        className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline  ${location.pathname === '/movie' ? 'bg-success text-white' : 'bg-white'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-film"></i>
          {sidebarOpen && <span className="ms-3">All Movies</span>}
        </div>
      </Link>

      <Link
        to="/movie/favorites"
        className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/movie/favorites' ? 'bg-success text-white' : 'bg-white'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-heart-fill"></i>
          {sidebarOpen && <span className="ms-3">Favorite Movies</span>}
        </div>
      </Link>
    </>
  );

  return (
    <>
      <nav className="navbar navbar-light d-xxl-none">
        <div className="container  ">
          <button
            className="btn btn-white border-rounded"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
             position: 'fixed',
              zIndex: 1040,
              top: '0px',
              left: '17px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              color: 'black',
            }}
          > 
            ☰
          </button>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop d-xxl-none"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1020,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      <div
        ref={sidebarRef}
        className={`bg-white shadow vh-100 p-3 position-fixed top-0 start-0 ${sidebarOpen ? 'd-block' : 'd-none'} d-xxl-none`}
        style={{
          width: sidebarOpen ? '210px' : '0px',
          height: '100%',
          zIndex: 1030,
          transition: 'transform 0.3s ease-in-out',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="d-flex align-items-center mb-4 ">
          <img src="assets/logo.png" alt="Just Watch Logo" className="me-2" />
          {sidebarOpen && <span className="fw-bold fs-4">Just Watch</span>}
        </div>

        {commonLinks}

        {currentUser?.type === 1 && (
          <Link
            to="/admin"
            className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/admin' ? 'bg-success text-white' : 'bg-white'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-film"></i>
              {sidebarOpen && <span className="ms-3">Master Movies</span>}
            </div>
          </Link>
        )}
      </div>

      {/* Desktop version */}
      <div
        ref={sidebarRef}
        className={`bg-white shadow vh-100 p-3 position-fixed top-0 start-0 ${sidebarOpen ? 'd-block' : 'd-none'} d-xxl-block`}
        style={{
          width: sidebarOpen ? '210px' : '70px',
          height: '100%',
          zIndex: 1030,
          transition: 'transform 0.3s ease-in-out',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-10%)',
        }}
        onClick={() => setSidebarOpen(true)}
      >
        <div className="d-flex align-items-center mb-4">
          <img src="assets/logo.png" alt="Just Watch Logo" className="me-2" />
          {sidebarOpen && <span className="fw-bold fs-4">Just Watch</span>}
        </div>

        {commonLinks}

        {currentUser?.type === 1 && (
          <Link
            to="/admin"
            className={`nav-link text-black mb-2 my-3 p-3 no-focus-outline ${location.pathname === '/admin' ? 'bg-success text-white' : 'bg-white'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-person-video2"></i>
              {sidebarOpen && <span className="ms-3 ">Master Movies</span>}
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default Sidebar;
