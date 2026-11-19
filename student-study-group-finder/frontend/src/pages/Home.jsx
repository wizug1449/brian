import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.05em', fontSize: '0.9rem' }}>
          UGANDA CHRISTIAN UNIVERSITY
        </p>
        <h1 style={{ fontSize: '2.6rem', lineHeight: 1.2, marginBottom: '1rem' }}>
          Find Your Perfect<br />
          <span style={{ color: 'var(--primary)' }}>Study Group</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.15rem', marginBottom: '2rem' }}>
          Connect with classmates, create study groups for your courses, 
          schedule sessions, and learn together across the university.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
                Go to Dashboard
              </Link>
              <Link to="/groups" className="btn btn-outline" style={{ padding: '0.8rem 1.6rem' }}>
                Browse Groups
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
                Get Started Free
              </Link>
              <Link to="/groups" className="btn btn-outline" style={{ padding: '0.8rem 1.6rem' }}>
                Browse Groups
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-2" style={{ marginTop: '4rem' }}>
        {[
          { title: 'Create Groups', desc: 'Start a study group for any course. Add a clear focus and meeting location.' },
          { title: 'Discover & Join', desc: 'Search by course code, faculty or keyword and join groups that match your needs.' },
          { title: 'Schedule Sessions', desc: 'Leaders can set date, time and location (or online link) for upcoming study sessions.' },
          { title: 'Stay Connected', desc: 'Post announcements, ask questions and coordinate with your group members.' },
        ].map((f, i) => (
          <div key={i} className="card">
            <div className="card-title">{f.title}</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
