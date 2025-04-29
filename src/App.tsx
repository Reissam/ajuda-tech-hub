
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { Layout } from "@/components/Layout";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TicketsList from "./pages/TicketsList";
import NewTicket from "./pages/NewTicket";
import TicketDetails from "./pages/TicketDetails";
import UsersManagement from "./pages/UsersManagement";
import ClientsList from "./pages/ClientsList";
import ClientRegistration from "./pages/ClientRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TicketProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  } 
                />
                <Route 
                  path="/tickets" 
                  element={
                    <Layout>
                      <TicketsList />
                    </Layout>
                  } 
                />
                <Route 
                  path="/tickets/new" 
                  element={
                    <Layout>
                      <NewTicket />
                    </Layout>
                  } 
                />
                <Route 
                  path="/tickets/:id" 
                  element={
                    <Layout>
                      <TicketDetails />
                    </Layout>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <Layout>
                      <UsersManagement />
                    </Layout>
                  } 
                />
                <Route 
                  path="/clients" 
                  element={
                    <Layout>
                      <ClientsList />
                    </Layout>
                  } 
                />
                <Route 
                  path="/clients/new" 
                  element={
                    <Layout>
                      <ClientRegistration />
                    </Layout>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TicketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
