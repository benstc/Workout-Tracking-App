import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './components/HomePage.jsx'
import LoginPage from './components/LoginPage.jsx'
import WorkoutLog from './components/WorkoutLog.jsx'
import WeightLog from './components/WeightLog.jsx'
import Dashboard from './components/Dashboard.jsx'
import SignUp from './components/SignUp.jsx'
import WeightProgress from './components/WeightProgress.jsx'
import MyExercises from './components/MyExercises.jsx'
import ExerciseDetails from './components/ExerciseDetails.jsx'
import WorkoutHistory from "./components/WorkoutHistory.jsx"
import WorkoutDetails from "./components/WorkoutDetails.jsx"



function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logWorkout" element={
          <ProtectedRoute>
            <WorkoutLog />
          </ProtectedRoute>
        } />
        <Route path="/Dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        } />
        <Route path="/logWeight" element={
        <ProtectedRoute>
          <WeightLog />
        </ProtectedRoute>
        } />
        <Route path="/weightProgress" element={
          <ProtectedRoute>
            <WeightProgress />
          </ProtectedRoute>
        } />
        <Route path="/myExercises" element={
          <ProtectedRoute>
            <MyExercises />
          </ProtectedRoute>
        } />
        <Route path="/workoutHistory" element={
          <ProtectedRoute>
            <WorkoutHistory />
          </ProtectedRoute>
        } />
        <Route path="/exercises/:exerciseId" element={
          <ProtectedRoute>
            <ExerciseDetails />
          </ProtectedRoute>
        } />
        <Route path="/workouts/:workoutId" element={
          <ProtectedRoute>
            <WorkoutDetails />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
