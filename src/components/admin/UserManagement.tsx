import React, { useEffect, useState, useRef } from 'react';
import { getAllUsers, updateUserRole } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Upload, Check, X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin';
  clinic?: string;
  createdAt?: string;
  status?: 'active' | 'disabled';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<User>>({
    email: '',
    fullName: '',
    role: 'patient',
    status: 'active'
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call when backend is ready
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email!,
        fullName: formData.fullName!,
        role: formData.role as 'patient' | 'doctor' | 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setUsers([...users, newUser]);
      setShowCreateDialog(false);
      setFormData({ email: '', fullName: '', role: 'patient', status: 'active' });
      toast({ title: 'User created', description: `${newUser.fullName} has been added.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to create user', variant: 'destructive' });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      // TODO: Replace with actual API call when backend is ready
      const updated: User = {
        ...selectedUser,
        ...formData,
        role: formData.role as 'patient' | 'doctor' | 'admin'
      };

      setUsers(users.map(u => u.id === selectedUser.id ? updated : u));
      setShowEditDialog(false);
      setFormData({ email: '', fullName: '', role: 'patient', status: 'active' });
      setSelectedUser(null);
      toast({ title: 'User updated', description: `${updated.fullName} has been updated.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to update user', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to disable ${userName}?`)) return;
    try {
      // TODO: Replace with actual API call when backend is ready
      setUsers(users.filter(u => u.id !== userId));
      toast({ title: 'User disabled', description: `${userName} has been disabled.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to delete user', variant: 'destructive' });
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      const emailIdx = headers.indexOf('email');
      const nameIdx = headers.indexOf('fullname') || headers.indexOf('name');
      const roleIdx = headers.indexOf('role');

      if (emailIdx === -1 || nameIdx === -1) {
        toast({ title: 'Error', description: 'CSV must have email and fullname columns', variant: 'destructive' });
        return;
      }

      const newUsers: User[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        newUsers.push({
          id: Date.now().toString() + i,
          email: cols[emailIdx],
          fullName: cols[nameIdx],
          role: (cols[roleIdx] || 'patient').toLowerCase() as 'patient' | 'doctor' | 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }

      setUsers([...users, ...newUsers]);
      setShowImportDialog(false);
      setCsvFile(null);
      toast({ title: 'Import successful', description: `${newUsers.length} users imported.` });
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to parse CSV file', variant: 'destructive' });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Create, edit, and manage user accounts with roles and permissions.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Create User
            </Button>
            <Button onClick={() => setShowImportDialog(true)} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Import CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <div className="text-center py-8">Loading users...</div>}

          {!loading && users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Create one to get started.
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Role</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{user.fullName}</td>
                      <td className="py-3 px-2 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(user)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system with appropriate role and permissions.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(role) => setFormData({ ...formData, role: role as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and permissions.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(role) => setFormData({ ...formData, role: role as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(status) => setFormData({ ...formData, status: status as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Users from CSV</DialogTitle>
            <DialogDescription>Upload a CSV file with columns: email, fullname, role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed rounded-lg text-center">
              <Input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose CSV File
              </Button>
              {csvFile && (
                <p className="text-sm mt-2 text-muted-foreground">{csvFile.name}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
              <Button onClick={handleCSVImport}>Import Users</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
