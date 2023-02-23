import React, { useReducer, useContext } from 'react'
import { getEvents } from '../api/getEvents'

import { TEvent, TEventType } from '../types/types'

/**************************************************
//   SORT & FILTER OPTIONS
**************************************************/
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

/**************************************************
//   STATE
**************************************************/
interface DashboardState {
  events: TEvent[]
  eventsDisplay: TEvent[]
  isLoading: boolean
  sortBy: number
  filterBy: TEventType[]
  authenticated: boolean
}

const initialState: DashboardState = {
  events: [],
  eventsDisplay: [],
  isLoading: false,
  sortBy: 0,
  filterBy: filterOptions.map((opt) => opt.value),
  authenticated: false,
}

/**************************************************
//   ACTIONS
**************************************************/
enum ActionType {
  SetEventList = 'SET_EVENT_LIST',
  SetError = 'SET_ERROR',
  SetLoading = 'SET_LOADING',
  SetSort = 'SET_SORT',
  SetFilter = 'SET_FILTER',
  SetAuthenticated = 'SET_AUTHENTICATED',
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

interface SetAuthenticatedAction extends IAction {
  type: ActionType.SetAuthenticated
  value: boolean
}

type Action =
  | SetLoadingAction
  | SetEventListAction
  | SetErrorAction
  | SetSortAction
  | SetFilterAction
  | SetAuthenticatedAction

/**************************************************
//   ACTION GENERATORS
**************************************************/
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

const setAuthenticatedAction = (value: boolean): SetAuthenticatedAction => ({
  type: ActionType.SetAuthenticated,
  value,
})

/**************************************************
//   ACTION HANDLERS & FUNCTIONALITY
**************************************************/
function getEventListMiddleware(
  state: DashboardState,
  dispatch: React.Dispatch<Action>
) {
  dispatch(setLoadingAction(true))
  getEvents()
    .then((res: TEvent[]) => {
      dispatch(setEventListAction(res))
      dispatch(setLoadingAction(false))
    })
    .catch((e) => {
      console.log(e)
      dispatch(setErrorAction())
      dispatch(setLoadingAction(false))
    })
}

function setLoadingActionHandler(
  state: DashboardState,
  action: SetLoadingAction
): DashboardState {
  const { value } = action
  return { ...state, isLoading: value }
}

function setSortActionHandler(
  state: DashboardState,
  action: SetSortAction
): DashboardState {
  const { value } = action
  const { comparator } = sortOptions[value]

  const { events, filterBy, authenticated } = state

  const eventsCopy = sortAndFilter(events, value, filterBy, authenticated)
  return { ...state, sortBy: value, eventsDisplay: eventsCopy }
}

function sortAndFilter(
  events: TEvent[],
  sortBy: number,
  filterBy: TEventType[],
  authenticated: boolean
) {
  let eventsCopy = [...events]
  eventsCopy = eventsCopy.filter((event) => {
    if (filterBy.includes(event.event_type)) return true
    return false
  })
  eventsCopy.sort(sortOptions[sortBy].comparator)

  //NOTE(annies): Can do both filters at the same time (minor time save)
  if (!authenticated) {
    eventsCopy = eventsCopy.filter((event) => {
      if (event.permission !== 'private') return true
      return false
    })
  }

  return eventsCopy
}

function setFilterActionHandler(
  state: DashboardState,
  action: SetFilterAction
): DashboardState {
  const { value } = action
  const { events, sortBy, authenticated } = state

  const eventsCopy = sortAndFilter(events, sortBy, value, authenticated)

  return {
    ...state,
    filterBy: value,
    eventsDisplay: eventsCopy,
  }
}

function setAuthenticatedActionHandler(
  state: DashboardState,
  action: SetAuthenticatedAction
): DashboardState {
  const { value } = action
  return { ...state, authenticated: value }
}

/**************************************************
//   REDUCER
**************************************************/
function eventListReducer(
  state: DashboardState,
  action: Action
): DashboardState {
  let next: DashboardState

  switch (action.type) {
  case ActionType.SetEventList: {
    const { events } = action
    const { sortBy, filterBy, authenticated } = state

    const eventsCopy = sortAndFilter(events, sortBy, filterBy, authenticated)
    next = { ...state, events, eventsDisplay: eventsCopy }
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
  case ActionType.SetAuthenticated: {
    next = setAuthenticatedActionHandler(state, action)
    break
  }
  case ActionType.SetLoading: {
    next = setLoadingActionHandler(state, action)
    break
  }
  default: {
    throw new Error(`Unhandled action type: ${action.type}`)
  }
  }
  return next
}

/**************************************************
//   EXPORTED CONTEXT
**************************************************/
interface DashboardContextType {
  state: DashboardState
  actions: {
    getEventList: () => void
    setSortAction: (value: number) => void
    setFilterAction: (value: TEventType[]) => void
    setAuthenticatedAction: (value: boolean) => void
  }
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(
  undefined
)

interface DashboardContextProviderType {
  children?: React.ReactNode
}

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
      setAuthenticatedAction: (value: boolean) =>
        dispatch(setAuthenticatedAction(value)),
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
