import { useState, useEffect } from 'react';
import axios from '@/lib/axios/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Partnership } from '@/types';
import { Plus, Building2, Mail, Loader2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export default function Partnerships() {
    const [partnerships, setPartnerships] = useState<Partnership[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPartner, setNewPartner] = useState({ name: '', contact: '' });
    const { toast } = useToast();

    useEffect(() => {
        fetchPartnerships();
    }, []);

    const fetchPartnerships = async () => {
        try {
            // const { data } = await axios.get('/partnerships');
            // setPartnerships(data);

            // Mock data
            setPartnerships([
                { id: '1', name: 'University Hospital', contact: 'contact@hospital.edu', createdAt: new Date().toISOString(), status: 'active' },
                { id: '2', name: 'NeuroResearch Institute', contact: 'info@neuro-institute.org', createdAt: new Date().toISOString(), status: 'active' }
            ]);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch partnerships', error);
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            // await axios.post('/partnerships', newPartner);
            setPartnerships([...partnerships, { ...newPartner, id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'active' }]);
            toast({ title: "Partnership Created", description: `${newPartner.name} has been added.` });
            setIsDialogOpen(false);
            setNewPartner({ name: '', contact: '' });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to create partnership." });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Partnerships</h1>
                    <p className="text-muted-foreground">Manage ongoing research and clinical partnerships.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4" /> Add Partner</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-platter border-white/10">
                        <DialogHeader>
                            <DialogTitle>New Partnership</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organization Name</Label>
                                <Input
                                    id="name"
                                    value={newPartner.name}
                                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                                    placeholder="e.g. City Hospital"
                                    className="bg-black/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Email</Label>
                                <Input
                                    id="contact"
                                    value={newPartner.contact}
                                    onChange={(e) => setNewPartner({ ...newPartner, contact: e.target.value })}
                                    placeholder="contact@org.com"
                                    className="bg-black/20"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={!newPartner.name || !newPartner.contact}>Create Partnership</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {partnerships.map((partner) => (
                        <Card key={partner.id} className="border-white/10 shadow-premium backdrop-blur-xl bg-card/40 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-lg font-bold">{partner.name}</CardTitle>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Building2 className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <Mail className="mr-2 h-3 w-3" />
                                    {partner.contact}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-white/5 bg-white/5 mx-6 mb-6 rounded-lg flex justify-between items-center py-3 px-4 mt-auto">
                                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                                    <Check className="mr-1 h-3 w-3" /> Active
                                </Badge>
                                <span className="text-xs text-muted-foreground">Added {new Date(partner.createdAt).toLocaleDateString()}</span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
