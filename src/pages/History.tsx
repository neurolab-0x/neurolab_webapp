
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, Eye } from "lucide-react";

const History = () => {
  // Sample history data
  const historyItems = [
    { id: 1, date: "2023-11-15", type: "EEG Analysis", status: "Complete", result: "Focused" },
    { id: 2, date: "2023-11-10", type: "EEG Analysis", status: "Complete", result: "Relaxed" },
    { id: 3, date: "2023-11-05", type: "Brain Mapping", status: "Complete", result: "Neutral" },
    { id: 4, date: "2023-10-28", type: "EEG Analysis", status: "Complete", result: "Focused" },
    { id: 5, date: "2023-10-20", type: "Brain Mapping", status: "Complete", result: "Distracted" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="font-bold">Analysis History</h1>
              <p className="text-muted-foreground">View your past analysis sessions and results.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
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
              <CardTitle>Recent Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.result === "Focused" ? "bg-green-100 text-green-800" :
                          item.result === "Relaxed" ? "bg-blue-100 text-blue-800" :
                          item.result === "Neutral" ? "bg-gray-100 text-gray-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {item.result}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NeurAi &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default History;
