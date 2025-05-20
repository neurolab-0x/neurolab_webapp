import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, Eye } from "lucide-react";

const History = () => {
  // Sample history data
  const historyItems = [
    { id: 1, date: "2025-04-15", type: "EEG Analysis", status: "Complete", result: "Focused" },
    { id: 2, date: "2025-04-10", type: "EEG Analysis", status: "Complete", result: "Relaxed" },
    { id: 3, date: "2025-04-05", type: "Brain Mapping", status: "Complete", result: "Neutral" },
    { id: 4, date: "2025-03-28", type: "EEG Analysis", status: "Complete", result: "Focused" },
    { id: 5, date: "2025-03-20", type: "Brain Mapping", status: "Complete", result: "Distracted" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analysis History</h1>
            <p className="text-muted-foreground">View your past analysis sessions and results.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Filter by Date
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.result}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
