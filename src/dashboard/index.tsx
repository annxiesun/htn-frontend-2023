import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getEvents } from '../api/getEvents'
import { TEvent } from '../types/types'
import EventCard from './main/EventCard'
import EventList from './main/EventList'
import EventPage from './event/EventPage'
import {  DashboardContextProvider } from '../contexts/dashboard'
import Login from './login'

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/events" element={<DashboardContextProvider><EventList /></DashboardContextProvider>} />
        <Route path="/events/:eventId" element={<EventPage />} />;
        <Route path="/" element={<Login />} />;
      </Routes>
    </>
  )
}
