import styled, { css } from 'styled-components'

export const Container = styled.div`
  padding: 10px;
`

export const WeekdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  margin-bottom: 10px;
`

interface DayProps {
  marked?: boolean
}

export const Day = styled.div<DayProps>`
  text-align: center;
  ${props => props.marked && css`
    font-weight: 700;
  `}
`

interface DaysContainerProps {
  startDay: number
}

export const DaysContainer = styled(WeekdayContainer)<DaysContainerProps>`
  ${Day}:first-child {
    grid-column: ${props => props.startDay};
  }
`

export const WeekdayHeader = styled.div`
  text-align: center;
`


