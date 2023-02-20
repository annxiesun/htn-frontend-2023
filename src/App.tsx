import React from 'react';
import logo from './logo.svg';
import { ApplicationContextProvider } from './context';
import { Dashboard } from './dashboard';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
  ]);

  return (
    <div className="App">
      <ApplicationContextProvider>
        <RouterProvider router={router} />
      </ApplicationContextProvider>
    </div>
  );
}

export default App;
