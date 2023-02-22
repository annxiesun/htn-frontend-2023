import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Card, Input, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import styles from './login.module.css'

const USERNAME = 'chubbybunny'
const PASSWORD = 'password'

const AUTHENTICATED_KEY = 'authenticated'

const Login = (): JSX.Element => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    console.log(localStorage.getItem(AUTHENTICATED_KEY))
    if (localStorage.getItem(AUTHENTICATED_KEY) == 'true') {
      setLoginSuccess(true)
    }
  }, [])

  const onLogin = () => {
    console.log(username, password)
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
              <Title level={3}>{'Welcome to Hack the North!'}</Title>
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
          {!loginSuccess && (
            <Button type="primary" onClick={onLogin}>
              {'Login'}
            </Button>
          )}
          <Button type="default" href="/events">
            {'See Events'}
          </Button>
          {loginSuccess && (
            <Button type="default" onClick={onLogout}>
              {'Logout'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Login
