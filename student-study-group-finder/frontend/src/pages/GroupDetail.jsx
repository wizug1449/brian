import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  // Forms
  const [sessionForm, setSessionForm] = useState({ title: '', description: '', date: '', time: '', locationOrLink: '' });
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const isMember = group && user && group.members?.some(m => m.user?._id === user.id || m.user === user.id);
  const isLeader = group && user && (group.leader?._id === user.id || group.leader === user.id);

  const fetchAll = async () => {
    try {
      const [groupRes, sessionsRes, postsRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/sessions/group/${id}`),
        api.get(`/posts/group/${id}`)
      ]);
      setGroup(groupRes.data.group);
      setSessions(sessionsRes.data.sessions || []);
      setPosts(postsRes.data.posts || []);
    } catch (err) {
      setError('Failed to load group.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleJoin = async () => {
    if (!user) return;
    setJoining(true);
    try {
      await api.post(`/groups/${id}/join`);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', { ...sessionForm, groupId: id });
      setSessionForm({ title: '', description: '', date: '', time: '', locationOrLink: '' });
      setShowSessionForm(false);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create session');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', { groupId: id, content: postContent, type: postType });
      setPostContent('');
      setShowPostForm(false);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (error || !group) return <div className="container" style={{ padding: '3rem' }}><div className="alert alert-error">{error || 'Group not found'}</div></div>;

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h1 style={{ margin: 0 }}>{group.name}</h1>
              <span className="badge">{group.courseCode}</span>
              {group.isOnline && <span className="badge badge-online">Online</span>}
            </div>
            <p style={{ margin: 0 }}>{group.courseName} · {group.faculty}</p>
          </div>
          
          {user && !isMember && (
            <button className="btn btn-primary" onClick={handleJoin} disabled={joining}>
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          )}
          {isMember && <span className="badge" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>✓ Member</span>}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0.75rem' }}>{group.description}</p>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          📍 {group.location} · {group.memberCount} member{group.memberCount !== 1 ? 's' : ''} · 
          Leader: {group.leader?.name}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="detail-grid">
        {/* Sessions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Study Sessions</h2>
            {isMember && (
              <button className="btn btn-outline btn-sm" onClick={() => setShowSessionForm(!showSessionForm)}>
                {showSessionForm ? 'Cancel' : '+ Add Session'}
              </button>
            )}
          </div>

          {showSessionForm && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <form onSubmit={handleCreateSession}>
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-control" value={sessionForm.title} onChange={e => setSessionForm({...sessionForm, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" className="form-control" value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Location / Link</label>
                  <input className="form-control" value={sessionForm.locationOrLink} onChange={e => setSessionForm({...sessionForm, locationOrLink: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea className="form-control" value={sessionForm.description} onChange={e => setSessionForm({...sessionForm, description: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Create Session</button>
              </form>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="card empty-state" style={{ padding: '1.5rem' }}>No sessions scheduled yet.</div>
          ) : (
            sessions.map(s => (
              <div key={s._id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                <strong>{s.title}</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
                  {new Date(s.date).toLocaleDateString()} at {s.time}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>📍 {s.locationOrLink}</div>
              </div>
            ))
          )}
        </div>

        {/* Posts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Group Posts</h2>
            {isMember && (
              <button className="btn btn-outline btn-sm" onClick={() => setShowPostForm(!showPostForm)}>
                {showPostForm ? 'Cancel' : '+ New Post'}
              </button>
            )}
          </div>

          {showPostForm && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <form onSubmit={handleCreatePost}>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control" value={postType} onChange={e => setPostType(e.target.value)}>
                    <option value="general">General</option>
                    <option value="announcement">Announcement</option>
                    <option value="question">Question</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea className="form-control" value={postContent} onChange={e => setPostContent(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Post</button>
              </form>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="card empty-state" style={{ padding: '1.5rem' }}>No posts yet.</div>
          ) : (
            posts.map(p => (
              <div key={p._id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{p.author?.name}</strong>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>{p.type}</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>{p.content}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
