import React from 'react'
import { Route } from 'react-router-dom'
import { TEvent } from '../../types/types'

interface EventCardProps {
  event: TEvent
}

const EventCard = ({ event }: EventCardProps): JSX.Element => {
  const {
    id,
    name,
    event_type,
    permission,
    start_time,
    end_time,
    description,
    speakers,
    public_url,
    private_url,
    related_events,
  } = event

  return (
    <>
      {`${name} ${event_type}`}
      <br />
      <br />
    </>
  )
}

export default EventCard
