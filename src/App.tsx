import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import MemberList from "./pages/members/MemberList";
import MemberDetail from "./pages/members/MemberDetail";
import MemberCreate from "./pages/members/MemberCreate";
import DailyTickets from "./pages/DailyTickets";
import PaymentRegistration from "./pages/PaymentRegistration";
import LockerRoom from "./pages/LockerRoom";
import Attendance from "./pages/Attendance";
import MessageSystem from "./pages/MessageSystem";
import Calendar from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import TrainerManagement from "./pages/TrainerManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={
              localStorage.getItem("userRole") === "owner" ? <Dashboard /> : <TrainerDashboard />
            } />
            <Route path="members" element={<MemberList />} />
            <Route path="members/:id" element={<MemberDetail />} />
            <Route path="members/new" element={<MemberCreate />} />
            <Route path="daily-tickets" element={<DailyTickets />} />
            <Route path="payments" element={<PaymentRegistration />} />
            <Route path="locker-room" element={<LockerRoom />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="messages" element={<MessageSystem />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="trainers" element={<TrainerManagement />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
