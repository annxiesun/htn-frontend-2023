import React from 'react'
import {
  LinkOutlined,
  ShareAltOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import { Badge, List, Popover } from 'antd'
import moment from 'moment'
import { TEvent } from '../../../types/types'
import styles from './eventCardStyle.module.css'
import { COLORS, DATE_FORMAT, TIME_FORMAT } from '../../../constants'
import { useDashboardContext } from '../../../contexts/dashboard'

interface EventCardProps {
  event: TEvent
}

/**************************************************
//   Card display in EventList
**************************************************/
const EventCard = ({ event }: EventCardProps): JSX.Element => {
  const {
    id,
    name,
    event_type,
    start_time,
    end_time,
    description,
    speakers,
    public_url,
    private_url,
    related_events,
  } = event
  const { state } = useDashboardContext()
  const { authenticated } = state

  // FIXME(anniesun) duplicate of url & date format in event page, need to consolidate both to context
  const startDate = moment.utc(start_time).format(DATE_FORMAT)

  //NOTE(anniesun): start dates and end dates same
  // const endDate = moment(end_time).format(DATE_FORMAT)

  const startTime = moment.utc(start_time).format(TIME_FORMAT)
  const endTime = moment.utc(end_time).format(TIME_FORMAT)

  // Generates URL of event
  const url =
    window.location.protocol + '//' + window.location.host + `/events/${id}`
  const copyShareUrl = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <List.Item
      key={id}
      className={styles.eventCard}
      extra={
        <span className={styles.iconButtons}>
          {private_url && authenticated && (
            <a href={private_url}>
              <UnlockOutlined />
            </a>
          )}
          {public_url && (
            <a href={public_url}>
              <LinkOutlined />
            </a>
          )}
          <a onClick={copyShareUrl}>
            <Popover content={'Copied!'} trigger="click">
              <ShareAltOutlined />
            </Popover>
          </a>
        </span>
      }
    >
      <List.Item.Meta
        title={
          <div className={styles.primaryInfo}>
            <a href={url} className={styles.title}>{`${name}`}</a>
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
              className={styles.badge}
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
