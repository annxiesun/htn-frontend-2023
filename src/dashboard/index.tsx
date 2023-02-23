import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import EventList from './main/EventList'
import EventPage from './event/EventPage'
import { useDashboardContext } from '../contexts/dashboard'
import Login from './login'
import { AUTHENTICATED_KEY } from '../constants'

/**************************************************
//   Root component
**************************************************/
export const Dashboard = (): JSX.Element => {
  const { actions } = useDashboardContext()

  const { getEventList, setAuthenticatedAction } = actions

  useEffect(() => {
    getEventList()
    if (localStorage.getItem(AUTHENTICATED_KEY) == 'true') {
      setAuthenticatedAction(true)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:eventId" element={<EventPage />} />;
        <Route path="/" element={<Login />} />;
      </Routes>
    </>
  )
}
