import React from 'react'
import { Route } from 'react-router-dom'
import { TEvent } from '../../api/types'
import EventCard from './EventCard'
import uniqid from 'uniqid'

interface EventListProps {
  events: TEvent[];
}
const EventList = ({ events }: EventListProps): JSX.Element => {
	return (
		<>
			{events.map((event) => (
				<EventCard key={uniqid()} event={event} />
			))}
		</>
	)
}

export default EventList
