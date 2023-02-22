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
import { Button, List, Space, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  DownOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Select, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import styles from './eventList.module.css'
import Title from 'antd/es/typography/Title'
import { COLORS, AUTHENTICATED_KEY } from '../../constants'

const options = filterOptions

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
      className={styles.tag}
    >
      {label}
    </Tag>
  )
}

const EventList = (): JSX.Element => {
  const { state, actions } = useDashboardContext()

  const { eventsDisplay, sortBy, filterBy } = state

  const {
    getEventList,
    setSortAction,
    setFilterAction,
    setAuthenticatedAction,
  } = actions

  const handleSortChange = (e: number) => {
    setSortAction(e)
  }
  const handleFilterChange = (e: TEventType[]) => {
    setFilterAction(e)
  }

  useEffect(() => {
    getEventList()
    if (localStorage.getItem(AUTHENTICATED_KEY) == 'true') {
      setAuthenticatedAction(true)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span className={styles.header}>
          <a href="/">
            <ArrowLeftOutlined />
          </a>
          <Title level={3} className={styles.title}>
            {'Events'}
          </Title>
        </span>
        <div className={styles.controls}>
          <div>
            <Typography.Text>{'Sort by: '}</Typography.Text>
            <Select
              defaultValue={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              className={styles.select}
            />
          </div>
          <div>
            <Typography.Text>{'Filter by: '}</Typography.Text>
            <Select
              mode="multiple"
              defaultValue={filterBy}
              showArrow
              onChange={handleFilterChange}
              tagRender={tagRender}
              className={styles.select}
              options={options}
            />
          </div>
        </div>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page)
            },
            pageSize: 3,
          }}
          dataSource={eventsDisplay}
          renderItem={(event) => <EventCard key={uniqid()} event={event} />}
        />
      </div>
    </div>
  )
}

export default EventList
