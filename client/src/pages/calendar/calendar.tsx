import React from 'react'
import { isSameDay, getDay, getDaysInMonth } from 'date-fns'
import { Container, Current, Day, DayContainer, DaysContainer, Nav, NavigatorContainer, WeekdayContainer, WeekdayHeader } from './calendar-styles'
import { getMonthName } from '../../lib/month-names'
import { useStore } from '../../lib/store'

function leftPad(str: string, padding: string, width: number): string {
  if (!str) return str
  if (str.length >= width) return str
  let retStr = ''
  for (let i = 0; i < width - str.length; i++) {
    retStr += padding
  }
  return retStr + str
}

interface Props {
  onDayClick: (date: string) => void
}

export const Calendar: React.FC<Props> = ({ onDayClick }) => {
  const [year, setYear] = React.useState<number>(2021)
  const [month, setMonth] = React.useState<number>(11)
  const [days, setDays] = React.useState<Array<{date: number, hasItems: boolean, isToday: boolean}>>([])

  const { getEntries } = useStore()

  React.useEffect(() => {
    const today = new Date()
    getEntries().then((entries) => {
      let days = []
      for (let i = 1; i <= getDaysInMonth(new Date(year, month)); i++) {
        days.push({
          date: i,
          hasItems: entries.some((entry) => entry.day === `${year}-${month+1}-${leftPad(String(i), '0', 2)}`),
          isToday: isSameDay(today, new Date(year, month, i))
        })
      }
      setDays(days)
    })
  }, [year, month])

  const handleBackClick = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year-1)
    } else {
      setMonth(month-1)
    }
  }

  const handleForwardClick = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year+1)
    } else {
      setMonth(month+1)
    }
  }

  const handleDayClick = (e: React.MouseEvent<HTMLDivElement>, day: number) => {
    onDayClick(`${year}-${month+1}-${leftPad(String(day), '0', 2)}`)
  }

  const firstDayOfWeek = getDay(new Date(year, month, 1))
  return (
    <Container>
      <NavigatorContainer>
        <Nav onClick={handleBackClick}>
          <span className='material-icons'>
            chevron_left
          </span>
        </Nav>
        <Current>{getMonthName(month)} {year}</Current>
        <Nav onClick={handleForwardClick}>
          <span className='material-icons'>
            chevron_right
          </span>
        </Nav>
      </NavigatorContainer>
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
          <DayContainer>
            <Day
              onClick={(e) => handleDayClick(e, day.date)}
              marked={day.hasItems}
              today={day.isToday}
            >
              {day.date}
            </Day>
          </DayContainer>
        ))}
      </DaysContainer>
    </Container>
  )
}
