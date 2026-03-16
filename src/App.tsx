import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
import Home from './pages/Home'
import RecipePage from './pages/RecipePages'
import AllRecipes from './pages/AllRecipes'
import AddRecipe from './pages/adminPages/AddRecipe'
import EditRecipe from './pages/adminPages/EditRecipe'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AddTag from './pages/adminPages/AddTag'
import AdminHome from './pages/adminPages/AdminHome'
import { UserAuth } from './context/AuthContext'
import CookieConsentBanner from './components/CookieConsentBanner'

function App() {
  const { session } = UserAuth();
  const userId = session?.user.id;
  const isAdmin =  userId === import.meta.env.VITE_ADMIN_USER_ID;

  return (
    <>
      <ScrollToTop />
      <CookieConsentBanner />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/oppskrifter/:slug" element={<RecipePage />} />
      <Route path='/oppskrifter' element={<AllRecipes />} />
      {isAdmin && (
        <>
          <Route path="/admin/" element={<AdminHome />} />
          <Route path="/admin/add-recipe" element={<AddRecipe />} />
          <Route path="/admin/add-tag" element={<AddTag />} />
          <Route path="/admin/edit-recipe/:id" element={<EditRecipe />} />
        </>
      )}

      </Routes>
    </>
  )
}

export default App
