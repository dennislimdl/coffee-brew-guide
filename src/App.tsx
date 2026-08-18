import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import BrewPage from "@/pages/BrewPage";
import RecipeDetailPage from "@/pages/RecipeDetailPage";
import BrewFlowPage from "@/pages/BrewFlowPage";
import BrewDonePage from "@/pages/BrewDonePage";
import LearnHomePage from "@/pages/learn/LearnHomePage";
import TastingNotesPage from "@/pages/learn/TastingNotesPage";
import RoastLevelsPage from "@/pages/learn/RoastLevelsPage";
import OriginsPage from "@/pages/learn/OriginsPage";
import GlossaryPage from "@/pages/learn/GlossaryPage";
import CoffeeProcessPage from "@/pages/learn/CoffeeProcessPage";
import SpotsPage from "@/pages/spots/SpotsPage";
import AddSpotPage from "@/pages/spots/AddSpotPage";
import NavBar from "@/components/NavBar";

// Recipe detail + the guided brew flow are immersive, full-screen experiences
// with their own sticky action bars — the persistent tab bar would collide
// with those, so it's hidden for anything under /recipe/.
function useShowNavBar() {
  const { pathname } = useLocation();
  return !pathname.startsWith("/recipe/");
}

function AppRoutes() {
  const showNavBar = useShowNavBar();

  return (
    <>
      <div className={showNavBar ? "pb-16" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/brew" element={<BrewPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/recipe/:id/brew" element={<BrewFlowPage />} />
          <Route path="/recipe/:id/brew/done" element={<BrewDonePage />} />

          <Route path="/learn" element={<LearnHomePage />} />
          <Route path="/learn/process" element={<CoffeeProcessPage />} />
          <Route path="/learn/tasting-notes" element={<TastingNotesPage />} />
          <Route path="/learn/roast-levels" element={<RoastLevelsPage />} />
          <Route path="/learn/origins" element={<OriginsPage />} />
          <Route path="/learn/glossary" element={<GlossaryPage />} />

          <Route path="/spots" element={<SpotsPage />} />
          <Route path="/spots/new" element={<AddSpotPage />} />
        </Routes>
      </div>
      {showNavBar && <NavBar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
