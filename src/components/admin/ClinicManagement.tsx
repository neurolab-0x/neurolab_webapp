import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  contactPerson: string;
  hardwareType?: string;
  verified: boolean;
  credentialsSubmitted: boolean;
  createdAt?: string;
  latitude?: number;
  longitude?: number;
}

export default function ClinicManagement() {
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: '1',
      name: 'Ndera Hospital',
      address: 'KN 4 St, Kigali',
      city: 'Kigali',
      phone: '+250123456789',
      contactPerson: 'Dr. Jean Mutsinzi',
      hardwareType: 'Nihon Kohden EEG-1000',
      verified: true,
      credentialsSubmitted: true,
      latitude: -1.944,
      longitude: 30.055
    },
    {
      id: '2',
      name: 'King Faisal Hospital',
      address: 'KG 563 St, Kigali',
      city: 'Kigali',
      phone: '+250187654321',
      contactPerson: 'Dr. Marie Uwase',
      hardwareType: 'Nihon Kohden EEG-1200',
      verified: true,
      credentialsSubmitted: true,
      latitude: -1.943,
      longitude: 30.059
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const [formData, setFormData] = useState<Partial<Clinic>>({
    name: '',
    address: '',
    city: '',
    phone: '',
    contactPerson: '',
    hardwareType: '',
    verified: false,
    credentialsSubmitted: false
  });

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newClinic: Clinic = {
        id: Date.now().toString(),
        ...formData as Clinic,
        createdAt: new Date().toISOString()
      };

      setClinics([...clinics, newClinic]);
      setShowCreateDialog(false);
      setFormData({
        name: '',
        address: '',
        city: '',
        phone: '',
        contactPerson: '',
        hardwareType: '',
        verified: false,
        credentialsSubmitted: false
      });
      toast({ title: 'Clinic added', description: `${newClinic.name} has been added to the network.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to add clinic', variant: 'destructive' });
    }
  };

  const handleUpdateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinic) return;
    try {
      const updated: Clinic = {
        ...selectedClinic,
        ...formData
      } as Clinic;

      setClinics(clinics.map(c => c.id === selectedClinic.id ? updated : c));
      setShowEditDialog(false);
      setFormData({});
      setSelectedClinic(null);
      toast({ title: 'Clinic updated', description: `${updated.name} has been updated.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to update clinic', variant: 'destructive' });
    }
  };

  const handleDeleteClinic = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      setClinics(clinics.filter(c => c.id !== id));
      toast({ title: 'Clinic removed', description: `${name} has been removed.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to remove clinic', variant: 'destructive' });
    }
  };

  const handleVerifyClinic = async (clinic: Clinic) => {
    try {
      const updated = { ...clinic, verified: !clinic.verified };
      setClinics(clinics.map(c => c.id === clinic.id ? updated : c));
      toast({ 
        title: clinic.verified ? 'Clinic unverified' : 'Clinic verified', 
        description: `${clinic.name} is now ${updated.verified ? 'verified' : 'unverified'}.` 
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to verify clinic', variant: 'destructive' });
    }
  };

  const openEditDialog = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      phone: clinic.phone,
      contactPerson: clinic.contactPerson,
      hardwareType: clinic.hardwareType,
      verified: clinic.verified,
      credentialsSubmitted: clinic.credentialsSubmitted
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clinic & Hospital Management</CardTitle>
            <CardDescription>Add, verify, and manage partner clinics and hospitals with EEG capabilities.</CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Clinic
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <div className="text-center py-8">Loading clinics...</div>}

          {!loading && clinics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No clinics registered. Add one to get started.
            </div>
          )}

          {!loading && clinics.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clinics.map((clinic) => (
                <Card key={clinic.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {clinic.city}
                        </p>
                      </div>
                      {clinic.verified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 text-sm">
                    <p><span className="font-medium">Address:</span> {clinic.address}</p>
                    <p><span className="font-medium">Phone:</span> {clinic.phone}</p>
                    <p><span className="font-medium">Contact:</span> {clinic.contactPerson}</p>
                    {clinic.hardwareType && (
                      <p><span className="font-medium">Hardware:</span> {clinic.hardwareType}</p>
                    )}
                    <div className="flex gap-1 flex-wrap pt-2">
                      {clinic.credentialsSubmitted && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Credentials Submitted
                        </span>
                      )}
                      {clinic.verified && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <div className="border-t p-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant={clinic.verified ? "outline" : "default"}
                      onClick={() => handleVerifyClinic(clinic)}
                      className="flex-1"
                    >
                      {clinic.verified ? 'Unverify' : 'Verify'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(clinic)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteClinic(clinic.id, clinic.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Clinic Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Clinic</DialogTitle>
            <DialogDescription>Register a new healthcare facility to the NeuroLab network.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClinic} className="space-y-4">
            <div>
              <Label htmlFor="name">Clinic Name *</Label>
              <Input
                id="name"
                placeholder="Hospital Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Kigali"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+250..."
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                placeholder="Dr. Name"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hardware">EEG Hardware Type</Label>
              <Select value={formData.hardwareType || ''} onValueChange={(val) => setFormData({ ...formData, hardwareType: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hardware" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nihon Kohden EEG-1000">Nihon Kohden EEG-1000</SelectItem>
                  <SelectItem value="Nihon Kohden EEG-1200">Nihon Kohden EEG-1200</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button type="submit">Add Clinic</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Clinic Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>Update clinic details and information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClinic} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Clinic Name *</Label>
              <Input
                id="edit-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-city">City *</Label>
              <Input
                id="edit-city"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-hardware">EEG Hardware Type</Label>
              <Select value={formData.hardwareType || ''} onValueChange={(val) => setFormData({ ...formData, hardwareType: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hardware" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nihon Kohden EEG-1000">Nihon Kohden EEG-1000</SelectItem>
                  <SelectItem value="Nihon Kohden EEG-1200">Nihon Kohden EEG-1200</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="submit">Update Clinic</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
