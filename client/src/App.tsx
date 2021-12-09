import React from 'react'
import logo from './logo.svg'
import { Write } from './pages/write/Write'
import { Entries } from './components/entries'
import { initStore } from './lib/store'
import { TabBar, Tabs } from './components/tab-bar/tab-bar'
import { Toaster } from './components/toast/toast'

function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tabOpen, setTabOpen] = React.useState<Tabs>('list')

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
    console.log('asdasdas', item)
    setTabOpen(item)
  }

  return (
    <Toaster>
      <>
        {isLoading && <>
          Loading...
        </>}
        {!isLoading && <>
          {tabOpen === 'list' && <Entries />}
          {tabOpen === 'write' && <Write />}
          <TabBar onTabClick={handleTabClick} />
        </>}
      </>
    </Toaster>
  )
}

export default App;
