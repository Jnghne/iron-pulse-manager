
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import RoleBasedRedirect from "./pages/RoleBasedRedirect";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupOwner from "./pages/SignupOwner";
import Dashboard from "./pages/Dashboard";
import MemberList from "./pages/members/MemberList";
import MemberDetail from "./pages/members/MemberDetail";
import MemberCreate from "./pages/members/MemberCreate";
import DailyTickets from "./pages/DailyTickets";
import MyPage from "./pages/MyPage";

import LockerRoom from "./pages/LockerRoom";
import Attendance from "./pages/Attendance";
import MessageSystem from "./pages/MessageSystem";
import Calendar from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import StaffManagement from "./pages/staff/Staff";
import StaffDetail from "./pages/staff/StaffDetail";
import ProductListPage from "./pages/products/ProductListPage";
import Community from "./pages/Community";
import CommunityBoard from "./pages/community/CommunityBoard";
import PostDetail from "./pages/community/PostDetail";
import PostWrite from "./pages/community/PostWrite";
import CommunityMarket from "./pages/community/CommunityMarket";
import MarketItemDetail from "./pages/community/MarketItemDetail";
import MarketItemWrite from "./pages/community/MarketItemWrite";
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
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/owner" element={<SignupOwner />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<RoleBasedRedirect />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<MemberList />} />
            <Route path="members/:id" element={<MemberDetail />} />
            <Route path="members/new" element={<MemberCreate />} />
            <Route path="daily-tickets" element={<DailyTickets />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="locker-room" element={<LockerRoom />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="messages" element={<MessageSystem />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="staff/:id" element={<StaffDetail />} />
            <Route path="my-page" element={<MyPage />} />
            <Route path="community" element={<Community />} />
            <Route path="community/board" element={<CommunityBoard />} />
            <Route path="community/board/write" element={<PostWrite />} />
            <Route path="community/board/:id" element={<PostDetail />} />
            <Route path="community/market" element={<CommunityMarket />} />
            <Route path="community/market/write" element={<MarketItemWrite />} />
            <Route path="community/market/:id" element={<MarketItemDetail />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
