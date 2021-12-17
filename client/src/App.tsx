import React from 'react'
import logo from './logo.svg'
import { Write } from './pages/write/Write'
import { Entries } from './components/entries/entries'
import { initStore } from './lib/store'
import { TabBar, Tabs } from './components/tab-bar/tab-bar'
import { Toaster } from './components/toast/toast'
import { Calendar } from './pages/calendar/calendar'
import { Container } from './app-styles'
import { LoginModal } from './components/login-modal/login-modal'
import { Menu } from './components/menu/menu'

function getTodayKey() {
  return new Date().toLocaleDateString('sv', { year: 'numeric', month: 'numeric', day: 'numeric'})
}

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tabOpen, setTabOpen] = React.useState<Tabs>('list')
  const [writeDay, setWriteDay] = React.useState<string>(getTodayKey())

  /*
  React.useEffect(() => {
    setIsLoading(true)
    initStore().then(() => {
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])
  */

  const handleTabClick = (item: Tabs) => {
    if (item === 'write') {
      setWriteDay(getTodayKey())
    }
    console.log('asdasdas', item)
    setTabOpen(item)
  }

  const handleDayClick = (day: string) => {
    setWriteDay(day)
    setTabOpen('write')
  }

  const handleEntryClick = (day: string) => {
    setWriteDay(day)
    setTabOpen('write')
  }

  const handleWriteBack = () => {
    setTabOpen('list')
  }

  const handleLogin = (password: string) => {
    setIsLoading(true)
    initStore(password).then(() => {
      setIsSignedIn(true)
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      setIsLoading(false)
    })
  }

  return (
    <Toaster>
      <Container>
        {isSignedIn && <>
          {isLoading && <>
            Loading...
          </>}
          {!isLoading && <>
            <Menu />
            {tabOpen === 'calendar' && <Calendar onDayClick={handleDayClick} />}
            {tabOpen === 'list' && <Entries onEntryClick={handleEntryClick} />}
            {tabOpen === 'write' && <Write entryKey={writeDay} onBack={handleWriteBack} />}
            {tabOpen !== 'write' && <TabBar onTabClick={handleTabClick} />}
          </>}
        </>}
        {!isSignedIn && <LoginModal onLogin={handleLogin} />}
      </Container>
    </Toaster>
  )
}

export default App;
