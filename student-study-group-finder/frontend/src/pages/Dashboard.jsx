import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, sessionsRes] = await Promise.all([
          api.get('/groups/my/groups'),
          api.get('/sessions/my')
        ]);
        setMyGroups(groupsRes.data.groups || []);
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p>{user?.program} · Year {user?.yearOfStudy}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/create-group" className="btn btn-primary">+ Create Study Group</Link>
        <Link to="/groups" className="btn btn-outline">Browse All Groups</Link>
      </div>

      {/* My Groups */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>My Study Groups</h2>
      {myGroups.length === 0 ? (
        <div className="card empty-state">
          <p>You haven't joined any groups yet.</p>
          <Link to="/groups" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Find Groups
          </Link>
        </div>
      ) : (
        <div className="grid grid-2" style={{ marginBottom: '2.5rem' }}>
          {myGroups.map(group => (
            <Link key={group._id} to={`/groups/${group._id}`} className="card group-card" style={{ color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div className="card-title">{group.name}</div>
                <span className="badge">{group.courseCode}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {group.courseName}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                {group.memberCount} member{group.memberCount !== 1 ? 's' : ''} · {group.location}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Upcoming Sessions */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upcoming Sessions</h2>
      {sessions.length === 0 ? (
        <div className="card empty-state">
          <p>No upcoming study sessions.</p>
        </div>
      ) : (
        <div className="grid" style={{ gap: '0.75rem' }}>
          {sessions.map(session => (
            <div key={session._id} className="card" style={{ padding: '1.1rem 1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <strong>{session.title}</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    {session.group?.name} ({session.group?.courseCode})
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                  <div>{new Date(session.date).toLocaleDateString()}</div>
                  <div style={{ color: 'var(--muted)' }}>{session.time}</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                📍 {session.locationOrLink}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
