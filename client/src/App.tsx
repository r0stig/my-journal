import React from 'react'
import logo from './logo.svg'
import { Write } from './pages/write/Write'
import { Entries } from './components/entries/entries'
import { initStore } from './lib/store'
import { TabBar, Tabs } from './components/tab-bar/tab-bar'
import { Toaster } from './components/toast/toast'

function getTodayKey() {
  return new Date().toLocaleDateString('sv', { year: 'numeric', month: 'numeric', day: 'numeric'})
}

function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tabOpen, setTabOpen] = React.useState<Tabs>('list')
  const [writeDay, setWriteDay] = React.useState<string>(getTodayKey())

  React.useEffect(() => {
    setIsLoading(true)
    initStore().then(() => {
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])

  const handleTabClick = (item: Tabs) => {
    if (item === 'write') {
      setWriteDay(getTodayKey())
    }
    console.log('asdasdas', item)
    setTabOpen(item)
  }

  const handleEntryClick = (day: string) => {
    setWriteDay(day)
    setTabOpen('write')
  }

  return (
    <Toaster>
      <>
        {isLoading && <>
          Loading...
        </>}
        {!isLoading && <>
          {tabOpen === 'list' && <Entries onEntryClick={handleEntryClick} />}
          {tabOpen === 'write' && <Write entryKey={writeDay} />}
          <TabBar onTabClick={handleTabClick} />
        </>}
      </>
    </Toaster>
  )
}

export default App;
