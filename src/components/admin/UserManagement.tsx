import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users', err);
      setError(err?.message || 'Failed to fetch users from server');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId: string, role: string) => {
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast({ title: 'Role updated', description: `User role changed to ${role}` });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err?.message || 'Failed to update role', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading users...</div>}
        {!loading && users.length === 0 && (
          <div>
            {error ? (
              <div className="text-sm text-destructive">Failed to load users: {error}</div>
            ) : (
              <div>No users found.</div>
            )}
          </div>
        )}
        <div className="space-y-3">
          {users.map((u, index) => {
            const key = u.id ?? u._id ?? u.email ?? `user-${index}`;
            if (!u.id && !u._id) {
              console.warn('[UserManagement] user missing id, using fallback key', key, u);
            }
            return (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{u.fullName || u.username || u.email}</div>
                  <div className="text-xs text-muted-foreground">{u.email} • {u.role}</div>
                </div>
                <div className="flex gap-2">
                  {u.role !== 'doctor' && (
                    <Button size="sm" onClick={() => changeRole(u.id ?? u._id ?? key, 'doctor')}>Promote to Doctor</Button>
                  )}
                  {u.role !== 'admin' && (
                    <Button size="sm" variant="destructive" onClick={() => changeRole(u.id ?? u._id ?? key, 'admin')}>Make Admin</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
