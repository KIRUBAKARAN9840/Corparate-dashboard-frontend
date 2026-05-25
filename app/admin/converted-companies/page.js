'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiGlobe, FiPhoneCall, FiMapPin, FiChevronLeft, FiChevronRight, FiCheckSquare } from 'react-icons/fi';
import axios from 'axios';
import axiosInstance from '../../../lib/axios';

export default function AdminConvertedCompaniesListPage() {
  const [companies, setCompanies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gotoPageInput, setGotoPageInput] = useState('');
  const [overallTotalCount, setOverallTotalCount] = useState(0);

  const perPage = 50;

  // Cache & Request Cancellation references
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');

    // 1. Cancel previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 2. Client-side Cache lookup
    const cacheKey = `${page}_${search || ''}`;
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setCompanies(cached.data);
      setTotalCount(cached.totalCount);
      setOverallTotalCount(cached.overallTotalCount || cached.totalCount);
      setTotalPages(cached.totalPages);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/api/corporate/companies', {
        params: {
          page: page,
          per_page: perPage,
          search: search || undefined,
          converted: true
        },
        signal: controller.signal
      });

      if (response.status === 200) {
        const responseData = response.data.data || [];
        const total = response.data.total_count || 0;
        // Since we are filtering by converted=true, overall_total_count should be read from backend overall count for converted companies
        // Wait, the backend returns overall_total_count as count of ALL companies, but let's calculate the overall count of converted ones!
        // To do that, the backend returns overall_total_count, but since we are looking at converted-only portfolio, let's keep search = empty count as the overall converted total
        const overallTotal = search ? (overallTotalCount || total) : total;
        const totalP = response.data.total_pages || 1;

        // 3. Store in Client-side Cache
        cacheRef.current[cacheKey] = {
          data: responseData,
          totalCount: total,
          overallTotalCount: overallTotal,
          totalPages: totalP
        };

        setCompanies(responseData);
        setTotalCount(total);
        setOverallTotalCount(overallTotal);
        setTotalPages(totalP);
      }
    } catch (err) {
      // Ignore request cancellations securely to prevent flashing states or stale warnings
      if (
        axios.isCancel(err) ||
        err.code === 'ERR_CANCELED' ||
        err.name === 'CanceledError' ||
        err.name === 'AbortError' ||
        err.message === 'canceled' ||
        err.message?.includes('aborted')
      ) {
        return;
      }
      console.error('Failed to fetch companies', err);
      setError(err.response?.data?.detail || 'Failed to load companies list');
    } finally {
      // Only disable loading state if this is the active request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  // Perform fetching when search criteria or page bounds change
  useEffect(() => {
    fetchCompanies();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page, search]);

  // Reactive Search input listener with Debounce & Threshold checks
  useEffect(() => {
    // If search is fully cleared, reset back immediately
    if (!searchInput.trim()) {
      setPage(1);
      setSearch('');
      return;
    }

    // Enforce 2 character minimum threshold before dispatching search requests
    if (searchInput.trim().length < 2) {
      return;
    }

    // Debounce timer for 400ms to group typing strokes
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchClear = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleGotoPage = () => {
    const pageNum = parseInt(gotoPageInput, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
      setGotoPageInput('');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiCheckSquare style={{ color: 'var(--success)' }} /> Onboarded Companies
          </h1>
        </div>
        <div style={{ background: 'var(--success)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '600' }}>
          Total Onboarded: {overallTotalCount}
        </div>
      </div>

      {/* Industry-Standard Realtime Search Bar Section */}
      <div className="card" style={{ maxWidth: 'none', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Type onboarded company name to search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 2.5rem 0.65rem 2.25rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
          {loading && (
            <span style={{ position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%', display: 'flex', alignItems: 'center' }}>
              <div className="search-spinner"></div>
            </span>
          )}
          {searchInput && (
            <button
              type="button"
              onClick={handleSearchClear}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.25rem'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <strong>Error:</strong>
          <span>{error}</span>
          <button onClick={fetchCompanies} className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
            Retry Loading
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="card" style={{ maxWidth: 'none', padding: 0, overflow: 'hidden' }}>
        {loading && companies.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--secondary)' }}>
            <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="loading-spinner"></div>
              <span>Fetching onboarded portfolio...</span>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <FiCheckSquare size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#475569' }}>No onboarded companies found</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              We couldn't find any company matching your filter or page bounds.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', width: '25%' }}>COMPANY NAME</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', width: '35%' }}>ADDRESS</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', width: '20%' }}>CONTACT</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', width: '20%' }}>WEBSITE</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, index) => (
                    <tr
                      key={company.id || index}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.2s',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>{company.name}</div>
                          <span style={{ fontSize: '0.7rem', color: '#166534', background: '#dcfce7', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '600' }}>
                            Onboarded
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>
                          ID: {company.id}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', color: '#475569', fontSize: '0.875rem', lineHeight: '1.4' }}>
                        {company.address ? (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <FiMapPin size={14} style={{ color: 'var(--primary)', marginTop: '0.15rem', flexShrink: 0 }} />
                            <span>{company.address}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not specified</span>
                        )}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', color: '#475569', fontSize: '0.875rem' }}>
                        {company.contact ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiPhoneCall size={14} style={{ color: 'var(--success)' }} />
                            <span>{company.contact}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not specified</span>
                        )}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.875rem' }}>
                        {company.website ? (
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--primary)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontWeight: '500'
                            }}
                          >
                            <FiGlobe size={14} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', whiteSpace: 'nowrap' }}>
                              {company.website}
                            </span>
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not specified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--border)',
                  background: '#f8fafc',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> (50 companies per page)
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-primary"
                    style={{
                      width: 'auto',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      background: page === 1 ? '#cbd5e1' : 'var(--primary)'
                    }}
                  >
                    <FiChevronLeft size={16} /> Previous
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (page > 3 && totalPages > 5) {
                        pageNum = page - 3 + i;
                        if (pageNum + (4 - i) > totalPages) {
                          pageNum = totalPages - 4 + i;
                        }
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          style={{
                            border: '1px solid var(--border)',
                            background: page === pageNum ? 'var(--primary)' : 'white',
                            color: page === pageNum ? 'white' : 'var(--foreground)',
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.15s'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-primary"
                    style={{
                      width: 'auto',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      background: page === totalPages ? '#cbd5e1' : 'var(--primary)'
                    }}
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Go to:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={gotoPageInput}
                      onChange={(e) => setGotoPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGotoPage();
                        }
                      }}
                      placeholder="Page #"
                      style={{
                        width: '4rem',
                        padding: '0.35rem 0.5rem',
                        border: '1px solid var(--border)',
                        borderRadius: '0.375rem',
                        fontSize: '0.85rem',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      onClick={handleGotoPage}
                      className="btn-primary"
                      style={{
                        width: 'auto',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .search-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          border-top: 2px solid var(--primary);
          animation: spin 1s linear infinite;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
