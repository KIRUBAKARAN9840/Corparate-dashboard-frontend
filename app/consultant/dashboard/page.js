'use client';

import { FiUsers, FiTrendingUp, FiSettings, FiLayout, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

export default function ConsultantDashboard() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Consultant Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Welcome back! Manage your assigned client corporate rosters, tracking tools and metrics.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <Link href="/consultant/companies" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ maxWidth: 'none', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Active Companies</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem', color: '#0f172a' }}>24</p>
              </div>
              <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '50%' }}>
                <FiBriefcase size={20} />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '1rem', fontWeight: '600' }}>View company directory &rarr;</p>
          </div>
        </Link>

        <div className="card" style={{ maxWidth: 'none', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>My Clients</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem', color: '#0f172a' }}>128</p>
            </div>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '50%' }}>
              <FiUsers size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '1rem', fontWeight: '600' }}>+12 new this week</p>
        </div>

        <div className="card" style={{ maxWidth: 'none', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Consultations</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem', color: '#0f172a' }}>42</p>
            </div>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.75rem', borderRadius: '50%' }}>
              <FiTrendingUp size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '1rem', fontWeight: '600' }}>85% completion rate</p>
        </div>
      </div>
    </div>
  );
}
