import {
  LinkOutlined,
  ShareAltOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import { Badge, Card, List } from 'antd'
import moment from 'moment'
import React from 'react'
import { Route } from 'react-router-dom'
import { TEvent } from '../../types/types'
import styles from './eventCardStyle.module.css'
import { COLORS } from './EventList'

interface EventCardProps {
  event: TEvent
}

const dateFormat = 'MMMM DD, YYYY'
const timeFormat = 'hh:mm a'

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

  const startDate = moment.utc(start_time).format(dateFormat)

  //NOTE(anniesun): start dates and end dates same
  // const endDate = moment(end_time).format(dateFormat)

  const startTime = moment.utc(start_time).format(timeFormat)
  const endTime = moment.utc(end_time).format(timeFormat)

  const getShareUrl = () => {
    return `/events/${id}`
  }

  return (
    <List.Item
      key={id}
      className={styles.eventCard}
      extra={
        <span className={styles.iconButtons}>
          {private_url && (
            <a href={private_url}>
              <UnlockOutlined />
            </a>
          )}
          {public_url && (
            <a href={public_url}>
              <LinkOutlined />
            </a>
          )}
          <a href={getShareUrl()}>
            <ShareAltOutlined />
          </a>
        </span>
      }
    >
      <List.Item.Meta
        style={{
          width: '80%',
        }}
        title={
          <div className={styles.primaryInfo}>
            <>{`${name}`}</>
            {speakers.length != 0 && (
              <span className={styles.speaker}>
                {'by: '}
                {speakers.map((speaker) => (
                  <span key={speaker.name}>{speaker.name}</span>
                ))}
              </span>
            )}
            <Badge
              color={COLORS[event_type]}
              style={{ textTransform: 'capitalize' }}
              count={event_type.replaceAll('_', ' ')}
            />
          </div>
        }
        description={
          <div className={styles.secondaryInfo}>
            <span>{`${startDate} ${startTime} - ${endTime}`}</span>
          </div>
        }
      />
      <div className={styles.description}>{description}</div>
    </List.Item>
  )
}

export default EventCard
