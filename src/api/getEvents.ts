import { TEvent } from "./types";

export function getEvents():Promise<TEvent[]> {
  const res = new Promise<TEvent[]>((resolve, reject) => {
    fetch('https://api.hackthenorth.com/v3/events')
    .then(response => response.json())
    .then(data => {
      resolve(data)
    });
  })
  
  return res;
}