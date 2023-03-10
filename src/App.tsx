import React from 'react'
import logo from './logo.svg'
import { Dashboard } from './dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { DashboardContextProvider } from './contexts/dashboard'
function App() {
  const router = createBrowserRouter([
    {
      path: '/*',
      element: <Dashboard />,
    },
  ])

  return (
    <DashboardContextProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </DashboardContextProvider>
  )
}

export default App
