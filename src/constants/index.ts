import { TEventType } from '../types/types'

type ColorMap = {
  [key in TEventType]: string
}

export const COLORS: ColorMap = {
  activity: '#B298DC',
  tech_talk: '#94B8E2',
  workshop: '#87CECC',
}

export const AUTHENTICATED_KEY = 'authenticated'

export const DATE_FORMAT = 'MMMM DD, YYYY'
export const TIME_FORMAT = 'hh:mm a'