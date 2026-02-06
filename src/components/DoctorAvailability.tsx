import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import axios from '@/lib/axios/config';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Slot = { id?: string; day: string; start: string; end: string };

export default function DoctorAvailability() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState<Slot>({ day: 'Monday', start: '09:00', end: '12:00' });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const candidates = ['/doctors/availability', '/doctor/availability', '/availability/me'];
      for (const p of candidates) {
        try {
          const r = await axios.get<any>(p);
          if (r?.data) { setSlots(r.data || []); break; }
        } catch (e) { continue; }
      }
    } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      // optimistic UI
      const newSlot = { ...form };
      setSlots((s) => [...s, newSlot]);
      // attempt to persist
      await axios.post('/doctors/availability', form).catch(() => axios.post('/availability', form)).catch(() => null);
    } catch (e) {
      console.error("Failed to add availability", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (index: number) => {
    const item = slots[index];
    setSlots((s) => s.filter((_, i) => i !== index));
    if (item.id) {
      try { await axios.delete(`/doctors/availability/${item.id}`).catch(() => axios.delete(`/availability/${item.id}`)); } catch (e) { }
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-1 space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card className="border-white/5 shadow-premium bg-card/30 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
              <CardTitle className="text-xl font-bold tracking-tighter flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                Add Availability
              </CardTitle>
              <CardDescription className="text-sm font-medium">Define your working hours for patient sessions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Work Day</label>
                  <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="glass-platter">
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Start Time</label>
                    <input
                      type="time"
                      value={form.start}
                      onChange={(e) => setForm({ ...form, start: e.target.value })}
                      className="w-full h-12 rounded-xl border border-border/50 px-4 py-2 bg-muted/20 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">End Time</label>
                    <input
                      type="time"
                      value={form.end}
                      onChange={(e) => setForm({ ...form, end: e.target.value })}
                      className="w-full h-12 rounded-xl border border-border/50 px-4 py-2 bg-muted/20 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-14 rounded-2xl font-bold text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4"
                  onClick={handleAdd}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                  Add Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="border-white/5 shadow-premium bg-card/30 flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
              <CardTitle className="text-xl font-bold tracking-tighter flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-amber-500" />
                </div>
                Your Schedule
              </CardTitle>
              <CardDescription className="text-sm font-medium">Currently active booking windows.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading schedule...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {slots.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 border-2 border-dashed border-border/40 rounded-3xl"
                      >
                        <Clock className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">No availability set</p>
                      </motion.div>
                    ) : (
                      slots.map((s, i) => (
                        <motion.div
                          key={s.id || i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center justify-between p-5 bg-muted/10 border border-border/40 rounded-2xl hover:bg-muted/20 hover:border-border/60 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                              {s.day.substring(0, 2)}
                            </div>
                            <div>
                              <div className="text-lg font-bold tracking-tight">{s.day}</div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <Clock className="h-3 w-3" />
                                {s.start} — {s.end}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemove(i)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

