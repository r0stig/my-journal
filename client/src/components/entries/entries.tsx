import React from 'react'
import styled from 'styled-components'
import { Entry, useStore } from '../../lib/store'
import { Container, Content, Date, EntryCard, Header, Title, DateContainer, ContentContainer, Month } from './entries-styles'
import { isBefore, parseISO, getDate, getMonth } from 'date-fns'
import { getShortMonthName } from '../../lib/month-names'

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

  const { getEntries } = useStore()

  React.useEffect(() => {
    getEntries().then((entries) => {
      entries.sort((a, b) => {
        if (isBefore(parseISO(a.day), parseISO(b.day))) {
          return 1
        }
        return -1
      })
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
      {entries.map((entry) => {
        const date = parseISO(entry.day)
        const day = getDate(date)
        const monthName = getShortMonthName(getMonth(date))
        return (
          <EntryCard key={entry.day} onClick={(e) => handleEntryCardClick(e, entry)}>
            <DateContainer>
              <Date>
                {day}
              </Date>
              <Month>
                {monthName}
              </Month>
            </DateContainer>
            <ContentContainer>
              <Header>
                <Title>
                  {entry.title}
                </Title>
              </Header>
              <Content>
                {maybeShorten(entry.content, 100)}
              </Content>
            </ContentContainer>
          </EntryCard>
        )
      })}
    </Container>
  )
}

