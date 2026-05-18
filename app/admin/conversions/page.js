'use client';

export default function AdminConversions() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Global Conversions</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Aggregated conversion data across the platform.</p>
      </div>

      <div className="card" style={{ maxWidth: 'none' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Global Funnel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Overall Registration</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>100%</span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
              <div style={{ width: '100%', height: '100%', background: '#2563eb', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
