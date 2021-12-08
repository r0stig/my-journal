import React from 'react'
import styled from 'styled-components'
import { Entry, getEntries } from '../lib/store'

const Container = styled.div`

`

const ListItem = styled.div`
`

const ListHeader = styled.div``

const ListContent = styled.div``

const ListDate = styled.div``



export function Entries() {
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    getEntries().then((entries) => {
      setEntries(entries)
      console.log('set entries', entries)
    }).catch((err) => {
      console.error(err)
      setError('Error fetching entries')
    })
  }, [])

  return (
    <Container>
      {error && <>
        {error}
      </>}
      {entries.map((entry) => (
        <ListItem key={entry.day}>
          <ListHeader>
            {entry.title}
          </ListHeader>
          <ListContent>
            {entry.content}
          </ListContent>
          <ListDate>
            {entry.day}
          </ListDate>
        </ListItem>
      ))}
    </Container>
  )
}

