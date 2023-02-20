import React, { useState, useContext } from 'react'

import { TEvent } from '../api/types'

interface ApplicationContextType {
	events: TEvent[]
	setEvents: (events: TEvent[]) => void
}

interface ApplicationContextProviderType {
	children?: React.ReactNode
}

const ApplicationContext = React.createContext<
	ApplicationContextType | undefined
>(undefined)

export const useApplicationContext = () => {
	const applicationContext = useContext(ApplicationContext)

	if (!applicationContext) throw new Error('No Context Provider found')

	return applicationContext
}

export const ApplicationContextProvider = ({
	children,
}: ApplicationContextProviderType) => {
	const [events, setEvents] = useState<TEvent[]>([])

	const contextValue: ApplicationContextType = {
		events,
		setEvents,
	}

	return (
		<ApplicationContext.Provider value={contextValue}>
			{children}
		</ApplicationContext.Provider>
	)
}
