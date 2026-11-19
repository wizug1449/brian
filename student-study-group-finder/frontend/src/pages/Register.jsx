import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password:'',
    program:'',
    yearOfStudy: 1   });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...form,
        yearOfStudy: Number(form.yearOfStudy)
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 
                  err.response?.data?.errors?.[0]?.msg ||
                  'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Create account</h1>
        <p className="subtitle">Join the Student Study Group Finder</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@ucu.ac.ug"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Program of Study</label>
            <input
              type="text"
              name="program"
              className="form-control"
              value={form.program}
              onChange={handleChange}
              required
              placeholder="e.g. BSc Information Technology"
            />
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <select
              name="yearOfStudy"
              className="form-control"
              value={form.yearOfStudy}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6].map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
