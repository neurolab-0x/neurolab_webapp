import React, { useEffect, useState } from 'react';
import { getRoleChangeRequests, approveRoleRequest, rejectRoleRequest } from '@/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function RoleRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRoleChangeRequests();
      setRequests(data);
    } catch (err) {
      console.warn('No role requests endpoint or failed to load', err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string) => {
    try {
      await approveRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast({ title: 'Approved', description: 'Role request approved' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to approve', variant: 'destructive' });
    }
  };

  const reject = async (id: string) => {
    try {
      await rejectRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast({ title: 'Rejected', description: 'Role request rejected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to reject', variant: 'destructive' });
    }
  };

  if (!loading && requests.length === 0) return <div>No pending role requests.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Change Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading requests...</div>}
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{r.user?.fullName || r.user?.email}</div>
                <div className="text-xs text-muted-foreground">Requested role: {r.requestedRole}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approve(r.id)}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => reject(r.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
