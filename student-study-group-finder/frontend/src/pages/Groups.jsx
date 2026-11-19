import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGroups = async (query = '') => {
    setLoading(true);
    try {
      const params = query ? { search: query } : {};
      const res = await api.get('/groups', { params });
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGroups(search);
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1>Browse Study Groups</h1>
        <p>Discover groups by course, faculty or keyword</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-control"
          style={{ flex: 1, minWidth: '220px' }}
          placeholder="Search by course code, name or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        {search && (
          <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); fetchGroups(); }}>
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="card empty-state">
          <p>No study groups found.</p>
          <Link to="/create-group" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Create the first group
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {groups.map(group => (
            <Link key={group._id} to={`/groups/${group._id}`} className="card group-card" style={{ color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div className="card-title">{group.name}</div>
                <span className="badge">{group.courseCode}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {group.courseName}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {group.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                <span>
                  {group.isOnline ? <span className="badge badge-online">Online</span> : group.location}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
