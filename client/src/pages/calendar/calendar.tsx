import React from 'react'
import { getDay, getDaysInMonth } from 'date-fns'
import { Container, Day, DaysContainer, WeekdayContainer, WeekdayHeader } from './calendar-styles'
import { getEntries } from '../../lib/store'

function leftPad(str: string, padding: string, width: number): string {
  if (!str) return str
  if (str.length >= width) return str
  let retStr = ''
  for (let i = 0; i < width - str.length; i++) {
    retStr += padding
  }
  return retStr + str
}

export const Calendar: React.FC<{}> = () => {
  const [year, setYear] = React.useState<number>(2021)
  const [month, setMonth] = React.useState<number>(11)
  const [days, setDays] = React.useState<Array<{date: number, hasItems: boolean}>>([])

  React.useEffect(() => {
    getEntries().then((entries) => {
      let days = []
      for (let i = 1; i <= getDaysInMonth(new Date(year, month)); i++) {
        days.push({
          date: i,
          hasItems: entries.some((entry) => entry.day === `${year}-${month+1}-${leftPad(String(i), '0', 2)}`)
        })
      }
      setDays(days)
    })
  }, [year, month])

 const firstDayOfWeek = getDay(new Date(year, month, 1))
  return (
    <Container>
      <WeekdayContainer>
        <WeekdayHeader>Mon</WeekdayHeader>
        <WeekdayHeader>Tue</WeekdayHeader>
        <WeekdayHeader>Wed</WeekdayHeader>
        <WeekdayHeader>Thu</WeekdayHeader>
        <WeekdayHeader>Fri</WeekdayHeader>
        <WeekdayHeader>Sat</WeekdayHeader>
        <WeekdayHeader>Sun</WeekdayHeader>
      </WeekdayContainer>
      <DaysContainer startDay={firstDayOfWeek}>
        {days.map((day) => (
          <Day marked={day.hasItems}>{day.date}</Day>
        ))}
      </DaysContainer>
    </Container>
  )
}
