import React, { useState, useCallback } from 'react';
import {
  Camera,
  Plus,
  Loader2,
  Store,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Edit3,
  Trash2,
  MapPin,
  Monitor,
  X,
  Save,
  Play,
  AlertTriangle,
} from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api`;

const truncateUrl = (url, max = 42) => {
  if (!url) return '';
  if (url.length <= max) return url;
  return url.slice(0, max - 3) + '...';
};

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const authFetchHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

function ToggleChip({ label, checked, onChange, colored }) {
  return (
    <label
      className={`toggle-chip ${colored ? (checked ? 'toggle-chip--green' : 'toggle-chip--red') : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}>
        <span className="toggle-switch__thumb" />
      </span>
      <span className="toggle-chip__label">{label}</span>
    </label>
  );
}

function StatusDot({ active }) {
  return (
    <span
      className={`cam-card__active-dot ${active ? 'cam-card__active-dot--on' : 'cam-card__active-dot--off'}`}
    />
  );
}

function CameraCard({ cam, onEdit, onDelete, onToggle }) {
  const status = cam.connection_status || 'unknown';

  const statusConfig = {
    unknown: {
      icon: <Wifi size={11} />,
      label: 'Not Tested',
      cls: 'unknown',
    },
    success: {
      icon: <CheckCircle2 size={11} />,
      label: 'Connected',
      cls: 'success',
    },
    fail: {
      icon: <WifiOff size={11} />,
      label: 'Failed',
      cls: 'fail',
    },
  };

  const s = statusConfig[status] ?? statusConfig.unknown;

  return (
    <div className={`cam-card cam-card--${status}`}>
      <div className="cam-card__header">
        <div className="cam-card__icon">
          <Camera size={16} />
        </div>

        <div className="cam-card__info">
          <div className="cam-card__name-row">
            <h3 className="cam-card__name">{cam.name}</h3>
            <StatusDot active={!!cam.activate} />
          </div>

          <p className="cam-card__url">{truncateUrl(cam.url)}</p>
        </div>

        <div className="cam-card__actions">
          <button className="icon-btn" onClick={() => onEdit(cam)}>
            <Edit3 size={12} />
          </button>

          <button
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(cam)}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="cam-card__meta">
        <span className="meta-chip">
          <MapPin size={10} />
          {cam.location}
        </span>

        <span className="meta-chip">
          <Monitor size={10} />
          {truncateUrl(cam.webrtc_url, 24)}
        </span>

        <span className={`cam-status cam-status--${s.cls}`}>
          <span className="cam-status__dot" />
          {s.label}
        </span>
      </div>

      <div className="cam-card__toggles">
        <ToggleChip
          label="Re-ID"
          checked={!!cam.reid}
          onChange={v => onToggle(cam, 'reid', v)}
          colored
        />

        <ToggleChip
          label="Gender&Age"
          checked={!!cam.gender_age}
          onChange={v => onToggle(cam, 'gender_age', v)}
          colored
        />

        <ToggleChip
          label="Activate"
          checked={!!cam.activate}
          onChange={v => onToggle(cam, 'activate', v)}
          colored
        />
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="modal-overlay confirm-overlay"
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal confirm-modal">
        <div className="confirm-modal__header">
          <div className="confirm-modal__icon">
            <AlertTriangle size={22} />
          </div>

          <h3>{title}</h3>
        </div>

        <div className="confirm-modal__body">
          <p>{message}</p>
          {itemName && (
            <span className="confirm-item-name">{itemName}</span>
          )}
        </div>

        <div className="confirm-modal__footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CameraModal({ cam, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    name: cam?.name ?? '',
    url: cam?.url ?? '',
    location: cam?.location ?? '',
    webrtc_url: cam?.webrtc_url ?? '',
    reid: cam?.reid ?? false,
    gender_age: cam?.gender_age ?? false,
    activate: cam?.activate ?? false,
  });

  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const set = (k, v) => {
    if (k === 'url') setTestStatus(null);
    setForm(p => ({ ...p, [k]: v }));
  };

  const valid =
    form.name.trim() &&
    form.url.trim() &&
    form.location.trim();

  const handleTest = useCallback(async () => {
    if (!form.url.trim()) return;

    setTesting(true);
    setTestStatus(null);

    try {
      const res = await fetch(`${API}/test_camera`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ url: form.url }),
        signal: AbortSignal.timeout(35000),
      });

      const result = await res.json();

      setTestStatus(result.success ? 'success' : 'fail');
    } catch {
      setTestStatus('fail');
    }

    setTesting(false);
  }, [form.url]);

  return (
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal__header">
          <h3>{cam ? 'Edit Camera' : 'Add Camera'}</h3>

          <button className="modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal__body">
          {[
            {
              label: 'Camera Name',
              key: 'name',
              ph: 'Entrance Camera 1',
            },
            {
              label: 'Stream URL',
              key: 'url',
              ph: 'rtsp://192.168.1.x:554/stream',
            },
            {
              label: 'Location / Zone',
              key: 'location',
              ph: 'Main Entrance',
            },
          ].map(({ label, key, ph }) => (
            <div className="form-group" key={key}>
              <label>
                {label} <span className="req">*</span>
              </label>

              <input
                className="form-input"
                placeholder={ph}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}

          <div className="form-group">
            <label>WebRTC URL</label>

            <input
              className="form-input"
              placeholder="https://webrtc.example.com/stream"
              value={form.webrtc_url}
              onChange={e => set('webrtc_url', e.target.value)}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          {testStatus !== 'success' ? (
            <button
              className={`btn-test btn-test--compact${
                testStatus === 'fail' ? ' btn-test--fail' : ''
              }`}
              onClick={handleTest}
              disabled={testing || !form.url.trim()}
            >
              {testing ? (
                <>
                  <Loader2 size={12} className="spin" />
                  Testing...
                </>
              ) : testStatus === 'fail' ? (
                <>
                  <WifiOff size={12} />
                  Failed - Retry
                </>
              ) : (
                <>
                  <Play size={12} />
                  Test Connection
                </>
              )}
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() =>
                valid &&
                onSave({
                  ...form,
                  connection_status: 'success',
                })
              }
              disabled={!valid || saving}
            >
              {saving ? (
                <Loader2 size={13} className="spin" />
              ) : (
                <Save size={13} />
              )}

              {cam ? 'Update Camera' : 'Add Camera'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CameraSettings({
  cameras,
  setCameras,
  loading,
  activeStore,
  addToast,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editCam, setEditCam] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [confirmDeleteCam, setConfirmDeleteCam] = useState(null);

  const handleToggle = useCallback(
    async (cam, field, value) => {
      setCameras(prev =>
        prev.map(c =>
          c.id === cam.id ? { ...c, [field]: value } : c
        )
      );

      try {
        const res = await fetch(
          `${API}/cameras/${cam.id}?store=${encodeURIComponent(
            activeStore
          )}`,
          {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({
              ...cam,
              [field]: value,
              store_name: activeStore,
            }),
          }
        );

        if (!res.ok) throw new Error();
      } catch {
        addToast('Failed to update camera', 'error');
      }
    },
    [setCameras, activeStore, addToast]
  );

  const saveCamera = useCallback(
    async formData => {
      setModalSaving(true);

      try {
        if (editCam) {
          await fetch(
            `${API}/cameras/${editCam.id}?store=${encodeURIComponent(
              activeStore
            )}`,
            {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({
                ...formData,
                store_name: activeStore,
              }),
            }
          );
        } else {
          await fetch(
            `${API}/cameras?store=${encodeURIComponent(
              activeStore
            )}`,
            {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({
                ...formData,
                store_name: activeStore,
              }),
            }
          );
        }

        const refreshed = await fetch(
          `${API}/cameras?store=${encodeURIComponent(
            activeStore
          )}`,
          {
            headers: authFetchHeaders(),
          }
        ).then(r => r.json());

        setCameras(refreshed);

        setShowModal(false);
        setEditCam(null);

        addToast(
          editCam ? 'Camera updated' : 'Camera added',
          'success'
        );
      } catch {
        addToast('Failed to save camera', 'error');
      }

      setModalSaving(false);
    },
    [editCam, activeStore, setCameras, addToast]
  );

  const handleConfirmDeleteCamera = useCallback(async () => {
    if (!confirmDeleteCam) return;

    try {
      await fetch(
        `${API}/cameras/${confirmDeleteCam.id}?store=${encodeURIComponent(
          activeStore
        )}`,
        {
          method: 'DELETE',
          headers: authFetchHeaders(),
        }
      );

      setCameras(prev =>
        prev.filter(c => c.id !== confirmDeleteCam.id)
      );

      addToast('Camera removed', 'success');
    } catch {
      addToast('Failed to delete camera', 'error');
    }

    setConfirmDeleteCam(null);
  }, [confirmDeleteCam, activeStore, setCameras, addToast]);

  return (
    <div className="settings-section">
      {confirmDeleteCam && (
        <ConfirmModal
          title="Delete Camera"
          message="Are you sure you want to delete this camera?"
          itemName={confirmDeleteCam.name}
          onConfirm={handleConfirmDeleteCamera}
          onCancel={() => setConfirmDeleteCam(null)}
        />
      )}

      <div className="settings-section-header">
        <div>
          <h2 className="settings-section-title">
            Camera Sources
          </h2>

          <p className="settings-section-sub">
            Configure and verify your camera connections
          </p>
        </div>

        <button
          className="btn-add-cam"
          onClick={() => {
            setEditCam(null);
            setShowModal(true);
          }}
        >
          <Plus size={13} />
          Add Camera
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <Loader2 size={30} className="spin" />
          <p>Loading cameras...</p>
        </div>
      ) : cameras.length === 0 ? (
        <div className="empty-state">
          <Camera size={36} />
          <p>No cameras configured yet</p>
        </div>
      ) : (
        <div className="cameras-grid">
          {cameras.map(cam => (
            <CameraCard
              key={cam.id}
              cam={cam}
              onEdit={cam => {
                setEditCam(cam);
                setShowModal(true);
              }}
              onDelete={setConfirmDeleteCam}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CameraModal
          cam={editCam}
          onSave={saveCamera}
          onClose={() => {
            setShowModal(false);
            setEditCam(null);
          }}
          saving={modalSaving}
        />
      )}
    </div>
  );
}