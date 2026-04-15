import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as authService from '../services/auth.service';
import type { User, UserRole } from '../types';
import { Shield, Trash2, Users } from 'lucide-react';
import './UserManagement.css';

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const refresh = () => setUsers(authService.getAllUsers());

  useEffect(() => {
    refresh();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    authService.updateUserRole(userId, newRole);
    refresh();
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      authService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="user-mgmt">
      <div className="user-mgmt-header">
        <span className="user-count">
          <Users size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {users.length} team member{users.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="user-list">
        {users.map((u) => {
          const isSelf = u.id === currentUser?.id;
          return (
            <div className="user-card" key={u.id}>
              <div className="user-avatar">
                {u.name.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <div className="user-name">
                  {u.name}
                  {isSelf && <span className="user-self-badge" style={{ marginLeft: 8 }}>You</span>}
                </div>
                <div className="user-email">{u.email}</div>
                <div className="user-joined">Joined {formatDate(u.createdAt)}</div>
              </div>

              <div className="user-actions">
                <span className={`role-badge ${u.role}`}>{u.role}</span>

                {!isSelf && (
                  <>
                    <button
                      className="user-action-btn"
                      onClick={() =>
                        handleRoleChange(u.id, u.role === 'editor' ? 'viewer' : 'editor')
                      }
                      title={`Switch to ${u.role === 'editor' ? 'Viewer' : 'Editor'}`}
                    >
                      <Shield size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Make {u.role === 'editor' ? 'Viewer' : 'Editor'}
                    </button>

                    <button
                      className="user-action-btn danger"
                      onClick={() => handleDelete(u)}
                      title="Remove from team"
                    >
                      <Trash2 size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Remove Team Member?</h3>
            <p className="confirm-text">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) from the team? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="confirm-delete" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
