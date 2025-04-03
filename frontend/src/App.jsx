import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import UserHealthFormPage from "./pages/UserHealthFormPage";
import NutritionPage from "./pages/NutritionPage";

function App() {

  return (
    <>
      {/* <h1 className='text-red-500 text-3xl font-bold underline'>Hello world!</h1> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/userHealthForum" element={<UserHealthFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
