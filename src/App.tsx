
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext";

import Index from "./pages/Index";
import CreateReceipt from "./pages/CreateReceipt";
import ViewReceipt from "./pages/ViewReceipt";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReceiptProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-receipt" element={<CreateReceipt />} />
            <Route path="/receipt/:id" element={<ViewReceipt />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ReceiptProvider>
  </QueryClientProvider>
);

export default App;
