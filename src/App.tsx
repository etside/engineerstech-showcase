import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import OAuthConsent from "./pages/OAuthConsent";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ServicesMarketplace from "./pages/ServicesMarketplace";
import GovtServices from "./pages/GovtServices";
import GovtServiceDetail from "./pages/GovtServiceDetail";
import AirTickets from "./pages/AirTickets";
import AirTicketDetail from "./pages/AirTicketDetail";
import TechProducts from "./pages/TechProducts";
import TechProductDetail from "./pages/TechProductDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => console.error(err),
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* OAuth consent — standalone page, no site nav/footer */}
            <Route path="/oauth/consent" element={<OAuthConsent />} />
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
              {/* Govt. Services */}
              <Route path="/govt-services" element={<GovtServices />} />
              <Route path="/govt-services/:slug" element={<GovtServiceDetail />} />
              {/* End Govt. Services */}
              {/* Air Tickets */}
              <Route path="/air-tickets" element={<AirTickets />} />
              <Route path="/air-tickets/:slug" element={<AirTicketDetail />} />
              {/* End Air Tickets */}
              {/* Tech Products */}
              <Route path="/tech-products" element={<TechProducts />} />
              <Route path="/tech-products/:slug" element={<TechProductDetail />} />
              {/* End Tech Products */}
              {/* Marketplace */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/marketplace-services" element={<ServicesMarketplace />} />
              {/* End Marketplace */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/super-admin" element={<SuperAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
