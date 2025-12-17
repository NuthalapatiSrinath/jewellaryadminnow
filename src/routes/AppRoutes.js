import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import HomePage from "../pages/HomePage/HomePage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Parent Route: The Layout */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Child Route: The HomePage */}
          <Route index element={<HomePage />} />

          {/* <Route path="about" element={<AboutPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactUsPage />} />

         
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:id" element={<BlogDetailsPage />} /> */}
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
