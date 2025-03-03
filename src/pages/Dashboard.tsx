
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button"; // Added missing import
import { GROUPS, PAYMENT_STATUS, SPECIALIZATIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { mockDashboardStats, mockPayments, mockStudents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MoreHorizontal, TrendingUp, Users, Receipt, AlertCircle, Calendar, Search } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = mockDashboardStats;

  // Data for Payment Status Chart
  const paymentStatusData = [
    { name: "Full Payment", value: stats.fullPayments, color: "#22c55e" },
    { name: "Partial Payment", value: stats.partialPayments, color: "#f59e0b" },
    { name: "Outstanding", value: stats.outstandingPayments, color: "#ef4444" },
  ];

  // Data for Payment Method Chart
  const paymentMethodData = [
    { name: "MoMo", value: stats.momoPayments, color: "#6366f1" },
    { name: "Cash", value: stats.cashPayments, color: "#8b5cf6" },
  ];

  // Data for Specialization Chart
  const specializationData = Object.entries(stats.paymentsBySpecialization).map(
    ([key, value]) => ({
      name: key === "ITS" ? "Software" : key === "ITN" ? "Networking" : "Data Management",
      value,
      color: 
        key === "ITS" ? "#0ea5e9" : 
        key === "ITN" ? "#8b5cf6" : "#ec4899",
    })
  );

  // Data for Group Chart
  const groupData = Object.entries(stats.paymentsByGroup)
    .filter(([_, value]) => value > 0) // Only include groups with payments
    .map(([key, value]) => ({
      name: `Group ${key}`,
      value,
    }));

  // Recent payments with student names
  const recentPaymentsWithNames = stats.recentPayments.map(payment => {
    const student = mockStudents.find(s => s.id === payment.studentId);
    return {
      ...payment,
      studentName: student?.name || "Unknown Student",
      indexNumber: student?.indexNumber || "Unknown"
    };
  });

  // Get collection rate
  const collectionRate = stats.totalStudents > 0
    ? ((stats.fullPayments + stats.partialPayments) / stats.totalStudents) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the payment system and student statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            <Calendar className="mr-2 h-4 w-4" />
            Select Period
          </button>
        </div>
      </div>

      {/* Key statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmountCollected)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalPayments} payments
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all specializations
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <Progress value={collectionRate} className="h-2" />
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outstandingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Students with no payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover-scale">
              <CardHeader>
                <CardTitle>Payment Collections</CardTitle>
                <CardDescription>
                  Monthly payment collection statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Jan", total: 1800 },
                      { name: "Feb", total: 2200 },
                      { name: "Mar", total: 1900 },
                      { name: "Apr", total: 2800 },
                      { name: "May", total: 2100 },
                      { name: "Jun", total: 3100 },
                      { name: "Jul", total: 3400 },
                      { name: "Aug", total: 3900 },
                    ]}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `GH₵${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`GH₵${value}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 hover-scale">
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>
                  Distribution of payment statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} students`,
                        "Count",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payment By Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} payments`,
                        "Count",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payments By Specialization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={specializationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {specializationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} students`,
                        "Count",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Payments</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/payments')}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPaymentsWithNames.length > 0 ? (
                    recentPaymentsWithNames.slice(0, 4).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {payment.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {payment.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.indexNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[168px] text-muted-foreground">
                      <Receipt className="h-10 w-10 mb-2 opacity-20" />
                      <p>No recent payments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of payment patterns and student demographics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Search className="h-10 w-10 mx-auto opacity-20" />
                <p>Advanced analytics will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Access and download system-generated reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Search className="h-10 w-10 mx-auto opacity-20" />
                <p>Report generation will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
