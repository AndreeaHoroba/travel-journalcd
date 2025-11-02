import { useEffect, useState } from 'react';
import './BookingsPage.css';

const emptyForm = {
  type: 'hotel',
  destination: '',
  startDate: '',
  endDate: '',
  price: '',
  notes: '',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE = 'http://localhost:8080/api/bookings';

  const load = async () => {
    try {
      const res = await fetch(BASE);
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error('Failed to load bookings', e);
      alert('Failed to load bookings');
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: form.price === '' ? null : Number(form.price),
      };
      const res = await fetch(editingId ? `${BASE}/${editingId}` : BASE, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      await load();
      setForm(emptyForm);
      setEditingId(null);
    } catch (e) {
      console.error(e);
      alert('Could not save booking');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (b) => {
    setEditingId(b.id);
    setForm({
      type: b.type || 'hotel',
      destination: b.destination || '',
      startDate: b.startDate || '',
      endDate: b.endDate || '',
      price: b.price ?? '',
      notes: b.notes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.error(e);
      alert('Could not delete booking');
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="bookings-page">
      <h2>Bookings</h2>

      {/* Form */}
      <form className="booking-form" onSubmit={onSubmit}>
        <div className="row">
          <label>Type</label>
          <select name="type" value={form.type} onChange={onChange}>
            <option value="hotel">Hotel</option>
            <option value="flight">Flight</option>
            <option value="activity">Activity</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="row">
          <label>Destination</label>
          <input name="destination" value={form.destination} onChange={onChange} placeholder="e.g. Paris" required />
        </div>

        <div className="row two">
          <div>
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={onChange} />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={onChange} />
          </div>
        </div>

        <div className="row">
          <label>Price (€)</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} />
        </div>

        <div className="row">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Optional notes..." />
        </div>

        <div className="actions">
          <button type="submit" disabled={loading}>{editingId ? 'Update' : 'Add'} Booking</button>
          {editingId && (
            <button type="button" className="secondary" onClick={onCancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="booking-list">
        {bookings.length === 0 ? (
          <p className="empty">No bookings yet.</p>
        ) : bookings.map(b => (
          <div className="booking-card" key={b.id}>
            <div className="top">
              <span className={`badge ${b.type}`}>{b.type}</span>
              <h3>{b.destination}</h3>
            </div>
            <div className="meta">
              <span>{b.startDate || '—'} → {b.endDate || '—'}</span>
              <span>{b.price != null ? `${b.price} €` : '—'}</span>
            </div>
            {b.notes && <p className="notes">{b.notes}</p>}
            <div className="card-actions">
              <button onClick={() => onEdit(b)}>Edit</button>
              <button className="danger" onClick={() => onDelete(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
