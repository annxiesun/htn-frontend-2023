import { TEvent } from '../types/types'

export function getEvents(): Promise<TEvent[]> {
  const res = new Promise<TEvent[]>((resolve, reject) => {
    fetch('https://api.hackthenorth.com/v3/events')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        resolve(data)
      }).catch((e) => {
        console.log(e)
        reject()
      })
  })

  return res
}

export function getEvent(eventId: number): Promise<TEvent> {
  const res = new Promise<TEvent>((resolve, reject) => {
    if(eventId < 1 || eventId > 15) {
      reject()
    }
    fetch(`https://api.hackthenorth.com/v3/events/${eventId}`)
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((data) => {
        console.log(data)
        resolve(data)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  return res
}
