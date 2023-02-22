import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { TEvent, TEventType } from '../../types/types'
import EventCard from './EventCard'
import uniqid from 'uniqid'
import { getEvents } from '../../api/getEvents'
import {
  useDashboardContext,
  sortOptions,
  SortOption,
  FilterOption,
  filterOptions,
} from '../../contexts/dashboard'
import { Button, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Select, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'

const options = filterOptions

type ColorMap = {
  [key in TEventType]: string
}

const COLORS: ColorMap = {
  activity: '#f2da96',
  tech_talk: '#f2da96',
  workshop: '#f2da96',
}

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props

  const eventValue: TEventType = value
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const color: string = COLORS[eventValue]
  return (
    <Tag
      color={color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  )
}

const EventList = (): JSX.Element => {
  const { state, actions } = useDashboardContext()

  const { eventsDisplay, sortBy, filterBy } = state
  const { getEventList, setSortAction, setFilterAction } = actions

  const handleSortChange = (e: number) => {
    setSortAction(e)
  }
  const handleFilterChange = (e: TEventType[]) => {
    setFilterAction(e)
  }

  useEffect(() => {
    getEventList()
  }, [])

  //options.filter((opt) => !filterBy.includes(opt.value))

  return (
    <>
      <Select
        defaultValue={sortBy}
        style={{ width: '100%' }}
        onChange={handleSortChange}
        options={sortOptions}
      />
      <Select
        mode="multiple"
        defaultValue={filterBy}
        showArrow
        onChange={handleFilterChange}
        tagRender={tagRender}
        style={{ width: '100%' }}
        options={options}
      />
      <div>
        {eventsDisplay.map((event: TEvent) => (
          <EventCard key={uniqid()} event={event} />
        ))}
      </div>
    </>
  )
}

export default EventList
