'use client';

import { FiTrendingUp } from 'react-icons/fi';

export default function PerformancePage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FiTrendingUp style={{ color: 'var(--primary)' }} /> Performance Metrics
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Review statistics on conversion and dietitian coaching sessions.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 'none', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <FiTrendingUp size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#475569' }}>Analytics coming soon</h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
          Your diet coach and scheduler telemetry will load here once active sessions occur.
        </p>
      </div>
    </div>
  );
}
