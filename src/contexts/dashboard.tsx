import React, { useReducer, createContext, useContext } from 'react'
import { getEvents } from '../api/getEvents'

import { TEvent, TEventType } from '../types/types'

export type SortOption = {
  label: string
  value: number
  comparator: (e1: TEvent, e2: TEvent) => number
}

export const sortOptions: SortOption[] = [
  {
    label: 'Upcoming',
    value: 0,
    comparator: (e1, e2) => {
      if (e1.start_time < e2.start_time) {
        return 1
      } else {
        return -1
      }
    },
  },
  {
    label: 'Alphabetical',
    value: 1,
    comparator: (e1, e2) => {
      if (e1.name > e2.name) {
        return 1
      } else {
        return -1
      }
    },
  },
]

export interface FilterOption {
  label: string
  value: TEventType
}

export const filterOptions: FilterOption[] = [
  {
    label: 'Activity',
    value: 'activity',
  },
  {
    label: 'Tech Talk',
    value: 'tech_talk',
  },
  {
    label: 'Workshop',
    value: 'workshop',
  },
]

interface DashboardState {
  events: TEvent[]
  eventsDisplay: TEvent[]
  isLoading: boolean
  sortBy: number
  filterBy: TEventType[]
}

interface DashboardContextProviderType {
  children?: React.ReactNode
}

const initialState: DashboardState = {
  events: [],
  eventsDisplay: [],
  isLoading: false,
  sortBy: 0,
  filterBy: filterOptions.map((opt) => opt.value),
}

enum ActionType {
  SetEventList = 'SET_EVENT_LIST',
  SetError = 'SET_ERROR',
  SetLoading = 'SET_LOADING',
  SetSort = 'SET_SORT',
  SetFilter = 'SET_FILTER',
}

interface IAction {
  type: ActionType
}

interface SetEventListAction extends IAction {
  type: ActionType.SetEventList
  events: TEvent[]
}
interface SetErrorAction extends IAction {
  type: ActionType.SetError
}

interface SetLoadingAction extends IAction {
  type: ActionType.SetLoading
  value: boolean
}

interface SetSortAction extends IAction {
  type: ActionType.SetSort
  value: number
}

interface SetFilterAction extends IAction {
  type: ActionType.SetFilter
  value: TEventType[]
}

type Action =
  | SetLoadingAction
  | SetEventListAction
  | SetErrorAction
  | SetSortAction
  | SetFilterAction

const setEventListAction = (events: TEvent[]): SetEventListAction => ({
  type: ActionType.SetEventList,
  events,
})

const setErrorAction = (): SetErrorAction => ({
  type: ActionType.SetError,
})

const setLoadingAction = (value: boolean): SetLoadingAction => ({
  type: ActionType.SetLoading,
  value,
})

const setSortAction = (value: number): SetSortAction => ({
  type: ActionType.SetSort,
  value,
})

const setFilterAction = (value: TEventType[]): SetFilterAction => ({
  type: ActionType.SetFilter,
  value,
})

function getEventListMiddleware(
  state: DashboardState,
  dispatch: React.Dispatch<Action>
) {
  getEvents()
    .then((res: TEvent[]) => {
      dispatch(setEventListAction(res))
    })
    .catch(() => {
      dispatch(setErrorAction())
    })
}

function setSortActionHandler(
  state: DashboardState,
  action: SetSortAction
): DashboardState {
  const { value } = action
  const { comparator } = sortOptions[value]

  const { events, filterBy } = state

  const eventsCopy = sortAndFilter(events, value, filterBy)
  return { ...state, sortBy: value, eventsDisplay: eventsCopy }
}

function sortAndFilter(
  events: TEvent[],
  sortBy: number,
  filterBy: TEventType[]
) {
  let eventsCopy = [...events]
  eventsCopy = eventsCopy.filter((event) => {
    if (filterBy.includes(event.event_type)) return true
    return false
  })
  eventsCopy.sort(sortOptions[sortBy].comparator)
  return eventsCopy
}

function setFilterActionHandler(
  state: DashboardState,
  action: SetFilterAction
): DashboardState {
  const { value } = action
  const { events, sortBy } = state

  const eventsCopy = sortAndFilter(events, sortBy, value)

  return {
    ...state,
    filterBy: value,
    eventsDisplay: eventsCopy,
  }
}

function eventListReducer(
  state: DashboardState,
  action: Action
): DashboardState {
  let next: DashboardState

  switch (action.type) {
  case ActionType.SetEventList: {
    const { events } = action
    const eventsCopy = sortAndFilter(events, state.sortBy, state.filterBy)
    next = { ...state, events, eventsDisplay: eventsCopy }
    break
  }
  case ActionType.SetLoading: {
    next = { ...state }
    break
  }
  case ActionType.SetSort: {
    next = setSortActionHandler(state, action)
    break
  }
  case ActionType.SetFilter: {
    next = setFilterActionHandler(state, action)
    break
  }
  default: {
    throw new Error(`Unhandled action type: ${action.type}`)
  }
  }
  return next
}

interface DashboardContextType {
  state: DashboardState
  actions: {
    getEventList: () => void
    setSortAction: (value: number) => void
    setFilterAction: (value: TEventType[]) => void
  }
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(
  undefined
)

const DashboardContextProvider = ({
  children,
}: DashboardContextProviderType) => {
  const [state, dispatch] = useReducer(eventListReducer, initialState)

  const contextValue = {
    state,
    actions: {
      getEventList: () => getEventListMiddleware(state, dispatch),
      setSortAction: (value: number) => dispatch(setSortAction(value)),
      setFilterAction: (value: TEventType[]) =>
        dispatch(setFilterAction(value)),
    },
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}

const useDashboardContext = () => {
  const applicationContext = useContext(DashboardContext)
  if (!applicationContext) throw new Error('No Context Provider found')
  return applicationContext
}

export { useDashboardContext, DashboardContextProvider }
