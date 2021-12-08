import React from 'react'
import { Container, TabItem } from './tab-bar-styles'

export type Tabs = 'calendar' | 'write' | 'list'
interface Props {
  onTabClick: (item: Tabs) => void
}

export const TabBar: React.FC<Props> = ({ onTabClick }) => {
  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Tabs) => {
    e.preventDefault()
    onTabClick(item)
  }

  return (
    <Container>
      <TabItem onClick={(e) => handleTabClick(e, 'calendar')}>Calendar</TabItem>
      <TabItem onClick={(e) => handleTabClick(e, 'write')}>Write</TabItem>
      <TabItem onClick={(e) => handleTabClick(e, 'list')}>List</TabItem>
    </Container>
  )
}

