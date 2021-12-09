import React from 'react'
import styled from 'styled-components'
import { Entry, getEntries } from '../../lib/store'
import { Content, Date, EntryCard, Header, Title } from './entries-styles'

const Container = styled.div`

`

function maybeShorten(str: string, max: number): string {
  if (!str) return str
  if (str.length > max) {
    return str.substr(0, max) + '...'
  }
  return str
}


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
        <EntryCard key={entry.day}>
          <Header>
            <Title>
              {entry.title} saksjdl aksjdlkas jdlakjsd lkajsdslkajs ldskajs
            </Title>
            <Date>
              {entry.day}
            </Date>
          </Header>
          <Content>
            {maybeShorten(entry.content, 200)}
          </Content>
        </EntryCard>
      ))}
    </Container>
  )
}

