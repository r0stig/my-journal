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

interface Props {
  onEntryClick: (day: string) => void
}

export const Entries: React.FC<Props> = ({ onEntryClick }) => {
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

  const handleEntryCardClick = (e: React.MouseEvent<HTMLDivElement>, entry: Entry) => {
    onEntryClick(entry.day)
  }

  return (
    <Container>
      {error && <>
        {error}
      </>}
      {entries.map((entry) => (
        <EntryCard key={entry.day} onClick={(e) => handleEntryCardClick(e, entry)}>
          <Header>
            <Title>
              {entry.title}
            </Title>
            <Date>
              {entry.day}
            </Date>
          </Header>
          <Content>
            {maybeShorten(entry.content, 100)}
          </Content>
        </EntryCard>
      ))}
    </Container>
  )
}

