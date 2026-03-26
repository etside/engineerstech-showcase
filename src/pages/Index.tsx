import { useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { downloadBrochurePDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { toast } = useToast();

  const handleDownloadPDF = useCallback(async () => {
    toast({
      title: "Generating PDF...",
      description: "Your brochure is being prepared for download.",
    });
    try {
      await downloadBrochurePDF();
      toast({
        title: "Brochure Downloaded!",
        description: "engineersTech_Brochure.pdf has been saved to your downloads.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Download Failed",
        description: "Please try again or contact info@engineerstechbd.com",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen">
      <Navbar onDownloadPDF={handleDownloadPDF} />
      <main>
        <HeroSection onDownloadPDF={handleDownloadPDF} />
        <AboutSection />
        <VisionMissionSection />
        <ProductsSection />
        <ServicesSection />
        <WhyUsSection />
        <ClientsSection />
      </main>
      <FooterSection onDownloadPDF={handleDownloadPDF} />
    </div>
  );
}
