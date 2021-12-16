import styled, { css } from 'styled-components'

export const Container = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: #fff;
`
export const NavigatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 5px;
`

export const Nav = styled.div`
  cursor: pointer;
`

export const Current = styled.div`

`

export const WeekdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  margin-bottom: 10px;
`

export const DayContainer = styled.div`
  display: flex;
  justify-content: center;
`

interface DayProps {
  marked?: boolean
  today?: boolean
}

export const Day = styled.div<DayProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  cursor: pointer;

  ${props => props.marked && css`
    font-weight: 700;
  `}
  ${props => props.today && css`
    background-color: #ddd;
    text-align: center;
    border-radius: 50%;
  `}
`

interface DaysContainerProps {
  startDay: number
}

export const DaysContainer = styled(WeekdayContainer)<DaysContainerProps>`
  ${DayContainer}:first-child {
    grid-column: ${props => props.startDay};
  }
`

export const WeekdayHeader = styled.div`
  text-align: center;
`


