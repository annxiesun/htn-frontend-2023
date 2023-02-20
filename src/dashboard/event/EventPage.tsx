import React from 'react'
import { useParams } from 'react-router-dom'
import { TEvent } from '../../api/types'

const EventPage = (): JSX.Element => {
	const params = useParams()
	const { eventId } = params

	return <>{eventId}</>
}

export default EventPage