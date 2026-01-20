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
import { Plus, Edit2, Trash2, DollarSign, TrendingUp } from 'lucide-react';

interface BillingRate {
  id: string;
  code: string;
  diagnosis: string;
  basePrice: number;
  rssbFee: number;
  description?: string;
  category: 'consultation' | 'eeg_basic' | 'eeg_detailed' | 'report' | 'teleconsult';
  createdAt?: string;
}

export default function BillingManagement() {
  const [rates, setRates] = useState<BillingRate[]>([
    {
      id: '1',
      code: 'A01',
      diagnosis: 'General Consultation',
      basePrice: 20,
      rssbFee: 25,
      category: 'consultation',
      description: 'Initial patient consultation'
    },
    {
      id: '2',
      code: 'B02',
      diagnosis: 'EEG Analysis (Basic)',
      basePrice: 45,
      rssbFee: 55,
      category: 'eeg_basic',
      description: 'Standard EEG recording and analysis'
    },
    {
      id: '3',
      code: 'C03',
      diagnosis: 'EEG Analysis (Detailed)',
      basePrice: 120,
      rssbFee: 150,
      category: 'eeg_detailed',
      description: 'Comprehensive EEG analysis with AI-assisted interpretation'
    },
    {
      id: '4',
      code: 'D04',
      diagnosis: 'Clinical Report Generation',
      basePrice: 30,
      rssbFee: 40,
      category: 'report',
      description: 'RSSB-tariffed diagnostic report'
    },
    {
      id: '5',
      code: 'E05',
      diagnosis: 'Teleconsultation',
      basePrice: 35,
      rssbFee: 45,
      category: 'teleconsult',
      description: 'Remote consultation with specialist'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRate, setSelectedRate] = useState<BillingRate | null>(null);

  const [formData, setFormData] = useState<Partial<BillingRate>>({
    code: '',
    diagnosis: '',
    basePrice: 0,
    rssbFee: 0,
    category: 'consultation',
    description: ''
  });

  // Calculate total revenue
  const totalMonthlyRevenue = rates.reduce((sum, rate) => sum + (rate.rssbFee * 10), 0); // Assuming ~10 of each service per month

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRate: BillingRate = {
        id: Date.now().toString(),
        code: formData.code!,
        diagnosis: formData.diagnosis!,
        basePrice: formData.basePrice!,
        rssbFee: formData.rssbFee!,
        category: (formData.category || 'consultation') as any,
        description: formData.description,
        createdAt: new Date().toISOString()
      };

      setRates([...rates, newRate]);
      setShowCreateDialog(false);
      setFormData({
        code: '',
        diagnosis: '',
        basePrice: 0,
        rssbFee: 0,
        category: 'consultation',
        description: ''
      });
      toast({ title: 'Billing rate added', description: `${newRate.diagnosis} has been added.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to add rate', variant: 'destructive' });
    }
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRate) return;
    try {
      const updated: BillingRate = {
        ...selectedRate,
        code: formData.code || selectedRate.code,
        diagnosis: formData.diagnosis || selectedRate.diagnosis,
        basePrice: formData.basePrice || selectedRate.basePrice,
        rssbFee: formData.rssbFee || selectedRate.rssbFee,
        category: (formData.category || selectedRate.category) as any,
        description: formData.description || selectedRate.description
      };

      setRates(rates.map(r => r.id === selectedRate.id ? updated : r));
      setShowEditDialog(false);
      setFormData({});
      setSelectedRate(null);
      toast({ title: 'Rate updated', description: `${updated.diagnosis} has been updated.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to update rate', variant: 'destructive' });
    }
  };

  const handleDeleteRate = async (id: string, diagnosis: string) => {
    if (!confirm(`Are you sure you want to remove ${diagnosis}?`)) return;
    try {
      setRates(rates.filter(r => r.id !== id));
      toast({ title: 'Rate removed', description: `${diagnosis} has been removed.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to remove rate', variant: 'destructive' });
    }
  };

  const openEditDialog = (rate: BillingRate) => {
    setSelectedRate(rate);
    setFormData({
      code: rate.code,
      diagnosis: rate.diagnosis,
      basePrice: rate.basePrice,
      rssbFee: rate.rssbFee,
      category: rate.category,
      description: rate.description
    });
    setShowEditDialog(true);
  };

  const calculateMarkup = (base: number, rssb: number) => {
    return Math.round(((rssb - base) / base) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Total Active Rates</p>
            <p className="text-3xl font-bold">{rates.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average RSSB Fee</p>
            <p className="text-3xl font-bold">${(rates.reduce((sum, r) => sum + r.rssbFee, 0) / rates.length).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Est. Monthly Revenue*</p>
            <p className="text-3xl font-bold">${totalMonthlyRevenue}</p>
          </div>
        </CardContent>
      </Card>

      {/* Billing Rates Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>RSSB-Aligned Billing Rates</CardTitle>
            <CardDescription>Manage service fees aligned with Rwanda Social Security Board tariffs.</CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Rate
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <div className="text-center py-8">Loading rates...</div>}

          {!loading && rates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No billing rates configured. Create one to get started.
            </div>
          )}

          {!loading && rates.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Code</th>
                    <th className="text-left py-3 px-2">Service</th>
                    <th className="text-left py-3 px-2">Category</th>
                    <th className="text-right py-3 px-2">Base Price</th>
                    <th className="text-right py-3 px-2">RSSB Fee</th>
                    <th className="text-right py-3 px-2">Markup</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate) => (
                    <tr key={rate.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-mono font-medium">{rate.code}</td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{rate.diagnosis}</p>
                          {rate.description && (
                            <p className="text-xs text-muted-foreground">{rate.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                          {rate.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">${rate.basePrice}</td>
                      <td className="py-3 px-2 text-right font-medium">${rate.rssbFee}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          +{calculateMarkup(rate.basePrice, rate.rssbFee)}%
                        </span>
                      </td>
                      <td className="py-3 px-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(rate)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteRate(rate.id, rate.diagnosis)}
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

      {/* Create Rate Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Billing Rate</DialogTitle>
            <DialogDescription>Create a new RSSB-aligned service fee.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRate} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="code">Service Code *</Label>
                <Input
                  id="code"
                  placeholder="A01"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="eeg_basic">EEG Basic</SelectItem>
                    <SelectItem value="eeg_detailed">EEG Detailed</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="teleconsult">Teleconsult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="diagnosis">Service Name *</Label>
              <Input
                id="diagnosis"
                placeholder="e.g., General Consultation"
                value={formData.diagnosis || ''}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="basePrice">Base Price ($) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice || ''}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rssbFee">RSSB Fee ($) *</Label>
                <Input
                  id="rssbFee"
                  type="number"
                  step="0.01"
                  value={formData.rssbFee || ''}
                  onChange={(e) => setFormData({ ...formData, rssbFee: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Service description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button type="submit">Add Rate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Rate Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Billing Rate</DialogTitle>
            <DialogDescription>Update service fee details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRate} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-code">Service Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="eeg_basic">EEG Basic</SelectItem>
                    <SelectItem value="eeg_detailed">EEG Detailed</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="teleconsult">Teleconsult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-diagnosis">Service Name *</Label>
              <Input
                id="edit-diagnosis"
                value={formData.diagnosis || ''}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-basePrice">Base Price ($) *</Label>
                <Input
                  id="edit-basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice || ''}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-rssbFee">RSSB Fee ($) *</Label>
                <Input
                  id="edit-rssbFee"
                  type="number"
                  step="0.01"
                  value={formData.rssbFee || ''}
                  onChange={(e) => setFormData({ ...formData, rssbFee: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="submit">Update Rate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
