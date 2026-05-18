'use client';

export default function AdminCompanies() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Corporate Companies</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Full access to all client accounts and billing.</p>
      </div>

      <div className="card" style={{ maxWidth: 'none', padding: '1rem' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem' }}>Global Directory</h2>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>+ Add Company</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>COMPANY NAME</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>CONTACT</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>STATUS</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>TechCorp Industries</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: COMP-001</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem' }}>john@techcorp.com</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Active</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn-ghost" style={{ textDecoration: 'none', color: '#2563eb' }}>Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
