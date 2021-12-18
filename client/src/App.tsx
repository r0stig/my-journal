import React from 'react'
import logo from './logo.svg'
import { Write } from './pages/write/Write'
import { Entries } from './components/entries/entries'
import { TabBar, Tabs } from './components/tab-bar/tab-bar'
import { Toaster } from './components/toast/toast'
import { Calendar } from './pages/calendar/calendar'
import { Container } from './app-styles'
import { LoginModal } from './components/login-modal/login-modal'
import { Menu } from './components/menu/menu'
import { useAccount } from './lib/use-account'
import { DataStorage, useStore } from './lib/store'

function getTodayKey() {
  return new Date().toLocaleDateString('sv', { year: 'numeric', month: 'numeric', day: 'numeric'})
}

function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tabOpen, setTabOpen] = React.useState<Tabs>('list')
  const [writeDay, setWriteDay] = React.useState<string>(getTodayKey())

  const { initStore } = useStore()
  const { signIn, isSignedIn } = useAccount()

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
      signIn()
      // setIsSignedIn(true)
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
            {tabOpen !== 'write' && <Menu />}
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
