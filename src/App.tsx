import React from 'react'
import logo from './logo.svg'
import { Dashboard } from './dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const router = createBrowserRouter([
    {
      path: '/*',
      element: <Dashboard />,
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
