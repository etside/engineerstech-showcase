import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import BusinessProfile from "./pages/BusinessProfile";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import AdminMCP from "./pages/AdminMCP";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import AiDiscover from "./pages/AiDiscover";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ForVendors from "./pages/ForVendors";
import HowItWorks from "./pages/HowItWorks";
import Leaderboards from "./pages/Leaderboards";
import Resources from "./pages/Resources";
import ApiDocs from "./pages/ApiDocs";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SuperAdmin from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/business/:slug" element={<BusinessProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ai-discover" element={<AiDiscover />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/mcp" element={<AdminMCP />} />
            <Route path="/for-vendors" element={<ForVendors />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
