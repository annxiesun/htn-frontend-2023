import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent } from '../../api/getEvents'
import { TEvent } from '../../types/types'

const EventPage = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null)

  const getEventId = new Promise<number>((resolve, reject) => {
    const params = useParams()
    const { eventId } = params
    let idNum: number
    if (eventId) {
      idNum = parseInt(eventId)
      if(isNaN(idNum)) {
        reject()
      } else {
        resolve(idNum)
      }
    }
  })

  const [event, setEvent] = useState<TEvent | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getEventId.then((eventId) => {
      setIsLoading(true)
      getEvent(eventId).then((res: TEvent) => {
        console.log(res)
        setEvent(res)
        setIsLoading(false)
      }).catch(() => {
        setError('Event not found')
      })
    }).catch(() => {
      setError('Event not found')
    })
  }, [])

  if(error) {
    return <>{error}</>
  }
  if (event === null) {
    return <>hi</>
  }

  const {
    name,
    // event_type,
    // permission,
    // start_time,
    // end_time,
    // description,
    // speakers,
    // public_url,
    // private_url,
    // related_events,
  } = event

  return <>{`${name}`}</>
}

export default EventPage
