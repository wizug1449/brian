import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateGroup() {
  const [form, setForm] = useState({
    name: '',
    courseCode: '',
    courseName: '',
    description: '',
    location: '',
    isOnline: false,
    faculty: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/groups', form);
      navigate(`/groups/${res.data.group._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1>Create Study Group</h1>
        <p>You will automatically become the group leader</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Advanced Algorithms Study Circle"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Course Code *</label>
              <input
                type="text"
                name="courseCode"
                className="form-control"
                value={form.courseCode}
                onChange={handleChange}
                required
                placeholder="CSC 3101"
              />
            </div>
            <div className="form-group">
              <label>Course Name *</label>
              <input
                type="text"
                name="courseName"
                className="form-control"
                value={form.courseName}
                onChange={handleChange}
                required
                placeholder="Data Structures & Algorithms"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="What is the focus of this study group?"
            />
          </div>

          <div className="form-group">
            <label>Meeting Location *</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Library Room 3 / Zoom / Discord"
            />
          </div>

          <div className="form-group">
            <label>Faculty (optional)</label>
            <input
              type="text"
              name="faculty"
              className="form-control"
              value={form.faculty}
              onChange={handleChange}
              placeholder="e.g. Computing and Technology"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              name="isOnline"
              id="isOnline"
              checked={form.isOnline}
              onChange={handleChange}
            />
            <label htmlFor="isOnline" style={{ marginBottom: 0 }}>This is primarily an online group</label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
}
