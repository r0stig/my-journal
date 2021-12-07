import React from 'react'
import styled from 'styled-components'
import { Entry } from '../lib/store'

const Container = styled.div`

`

const ListItem = styled.div`
`

const ListHeader = styled.div``

const ListContent = styled.div``

const ListDate = styled.div``



export function Entries() {
  const entries: Entry[] = [
    {
      title: 'title',
      day: '2021-01-01',
      content: 'Hejsan hoppsan hur står det till..'
    }
  ]
  return (
    <Container>
      {entries.map((entry) => (
        <ListItem>
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

