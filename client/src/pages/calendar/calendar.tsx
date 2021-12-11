import React from 'react'
import { getDay } from 'date-fns'
import { Container, Day, DaysContainer, WeekdayContainer, WeekdayHeader } from './calendar-styles'


export const Calendar: React.FC<{}> = () => {
  const [year, setYear] = React.useState<number>(2021)
  const [month, setMonth] = React.useState<number>(11)

  let days = []
  for (let i = 1; i < 30; i++) {
    days.push({
      date: i,
      hasItems: false
    })
  }
  const firstDayOfWeek = getDay(new Date(year, month, 1))
  console.log('first day of week', firstDayOfWeek)
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
          <Day>{day.date}</Day>
        ))}
      </DaysContainer>
    </Container>
  )
}
