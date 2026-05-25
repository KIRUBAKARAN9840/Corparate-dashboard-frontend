'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiLogOut, FiChevronLeft } from 'react-icons/fi';
import axiosInstance from '../../lib/axios';
import { getTabsByRole } from '../../lib/rolebase';

export default function ConsultantLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    
    if (userData.role !== 'consultant') {
      router.push('/login');
      return;
    }
    
    setUser(userData);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/corporate/auth/logout');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const navItems = getTabsByRole('consultant');

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-logo">
          {isMinimized ? 'FY' : <>FY<span>MBLE</span></>}
        </div>
        
        <div className="sidebar-toggle" onClick={() => setIsMinimized(!isMinimized)}>
          <FiChevronLeft size={16} />
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              title={isMinimized ? item.name : ''}
            >
              <item.icon size={18} />
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout} 
            className="nav-item" 
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            title={isMinimized ? 'Logout' : ''}
          >
            <FiLogOut size={18} />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isMinimized ? 'minimized' : ''}`}>
        <header className="topbar">
          <div className="page-info">
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Consultant Portal</span>
          </div>
          
          <div className="user-profile">
            <div style={{ textAlign: 'right', marginRight: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.role?.toUpperCase()}</div>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
