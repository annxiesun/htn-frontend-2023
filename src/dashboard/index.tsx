import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getEvents } from '../api/getEvents'
import { TEvent } from '../api/types'
import { useApplicationContext } from '../context'
import EventCard from './event/EventCard'
import EventList from './event/EventList'
import EventPage from './event/EventPage'

export const Dashboard = (): JSX.Element => {
	const { events, setEvents } = useApplicationContext()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		getEvents().then((res: TEvent[]) => {
			setEvents(res)
			setIsLoading(false)
		})
	}, [])

	return (
		<>
			<Routes>
				<Route
					path="/events"
					element={
						<EventList events={events}/>
					}
				/>
				<Route
					path="/events/:eventId"
					element={<EventPage />}
				/>
        ;
			</Routes>
		</>
	)
}
