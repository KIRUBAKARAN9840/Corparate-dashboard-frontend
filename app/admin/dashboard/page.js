'use client';

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Total Companies</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>24</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Total Employees</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>1,420</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Active Employees</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>984</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>AI Diet Coach</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>562</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>AI Credit</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>12,500</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Nutrition Consultation</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>184</p>
        </div>
        <div className="card" style={{ maxWidth: 'none' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '1rem' }}>Nutrition Plan</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>1M</span>
              <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>210</p>
            </div>
            <div style={{ paddingLeft: '2rem', borderLeft: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>3M</span>
              <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>102</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
