import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent } from '../../api/getEvents'
import { TEvent } from '../../types/types'
import { COLORS, DATE_FORMAT, TIME_FORMAT } from '../../constants'
import {
  UnlockOutlined,
  LinkOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { Popover, Badge, Card, Typography } from 'antd'
import moment from 'moment'
import { useDashboardContext } from '../../contexts/dashboard'
import styles from './eventPageStyle.module.css'
import Title from 'antd/es/typography/Title'

/**************************************************
//   Page to display single event
**************************************************/
const EventPage = (): JSX.Element => {
  const { state } = useDashboardContext()
  const { authenticated, events } = state

  const getEventId = new Promise<number>((resolve, reject) => {
    const params = useParams()
    const { eventId } = params
    let idNum: number
    if (eventId) {
      idNum = parseInt(eventId)
      if (isNaN(idNum)) {
        reject()
      } else {
        resolve(idNum)
      }
    }
  })

  const [event, setEvent] = useState<TEvent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getEventId
      .then((eventId) => {
        setIsLoading(true)
        getEvent(eventId)
          .then((res: TEvent) => {
            setEvent(res)
            setIsLoading(false)
          })
          .catch(() => {
            setError('Event not found')
          })
      })
      .catch(() => {
        setError('Event not found')
      })
  }, [])

  if (error) {
    return <>{error}</>
  }
  if (event === null) {
    return <></>
  }

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

  // FIXME(anniesun) duplicate of url & date format in event page, need to consolidate both to context
  const startDate = moment.utc(start_time).format(DATE_FORMAT)

  //NOTE(anniesun): start dates and end dates same
  // const endDate = moment(end_time).format(DATE_FORMAT)

  const startTime = moment.utc(start_time).format(TIME_FORMAT)
  const endTime = moment.utc(end_time).format(TIME_FORMAT)

  // Generates URL of event
  const getUrl = (urlId: number) => {
    return (
      window.location.protocol +
      '//' +
      window.location.host +
      `/events/${urlId}`
    )
  }

  const url = getUrl(id)
  const copyShareUrl = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className={styles.wrapper}>
      <Card
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
        <div className={styles.primaryInfo}>
          <a href="/events">
            <ArrowLeftOutlined />
          </a>
          <Title className={styles.title} level={3}>{`${name}`}</Title>
          <Badge
            color={COLORS[event_type]}
            className={styles.badge}
            count={event_type.replaceAll('_', ' ')}
          />
        </div>

        <div>
          {speakers.length != 0 && (
            <Title level={5} className={styles.title}>
              {'by: '}
              {speakers.map((speaker) => (
                <span key={speaker.name}>{speaker.name}</span>
              ))}
            </Title>
          )}
        </div>

        <Typography.Text type="secondary">{`${startDate} ${startTime} - ${endTime}`}</Typography.Text>
        <br />
        <br />
        <div className={styles.description}>{description}</div>
        <br />
        {(events.length != 0 && related_events.length != 0) && (
          <div className={styles.relatedEvents}>
            <Typography.Text strong>{'Related events: '}</Typography.Text>
            <>
              {related_events.map((i) => {
                return (
                  <Typography.Link key={i} href={getUrl(i)}>
                    {events[i-1].name}
                  </Typography.Link>
                )
              })}
            </>
          </div>
        )}
      </Card>
    </div>
  )
}

export default EventPage
