import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RecipePage from './pages/RecipePages'
import AllRecipes from './pages/AllRecipes'
import AddRecipe from './pages/adminPages/AddRecipe'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AddTag from './pages/adminPages/AddTag'
import AdminHome from './pages/adminPages/AdminHome'

function App() {


  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/recipes/:id" element={<RecipePage />} />
      <Route path='/recipes' element={<AllRecipes />} />
      <Route path='/admin/add-recipe' element={<AddRecipe />} />
      <Route path='/admin/add-tag' element={<AddTag />} />
      <Route path='/admin' element={<AdminHome />} />
      
      </Routes>
    </>
  )
}

export default App
