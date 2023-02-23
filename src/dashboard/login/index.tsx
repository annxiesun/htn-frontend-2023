import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Card, Input, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import styles from './login.module.css'
import { AUTHENTICATED_KEY } from '../../constants'

const USERNAME = 'chubbybunny'
const PASSWORD = 'password'

const Login = (): JSX.Element => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(AUTHENTICATED_KEY) == 'true') {
      setLoginSuccess(true)
    }
  }, [])

  const onLogin = () => {
    if (username == USERNAME && password == PASSWORD) {
      setLoginSuccess(true)
      localStorage.setItem(AUTHENTICATED_KEY, 'true')
    }
  }

  const onLogout = () => {
    setLoginSuccess(false)
    localStorage.removeItem(AUTHENTICATED_KEY)
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.loginCard}>
        {loginSuccess ? (
          <div className={styles.text}>
            <Title level={3}>{'Thanks for logging in!'}</Title>
            <Typography.Text type="secondary">
              {'Now go forth and explore...'}
            </Typography.Text>
          </div>
        ) : (
          <>
            <div className={styles.text}>
              <Title level={3}>{'Welcome to Hackathon Global!'}</Title>
              <Typography.Text type="secondary">
                {'Login to view exclusive events...'}
              </Typography.Text>
            </div>
            <div className={styles.inputContainer}>
              <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input.Password
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
          </>
        )}
        <div className={styles.buttonContainer}>
          {loginSuccess ? (
            <Button type="default" onClick={onLogout}>
              {'Logout'}
            </Button>
          ) : (
            <Button type="primary" onClick={onLogin}>
              {'Login'}
            </Button>
          )}
          <Button type="default" href="/events">
            {'See Events'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Login
