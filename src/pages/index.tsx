import Head from 'next/head'
import Image from 'next/image'
import { stringify } from 'querystring'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import UserNav from '../components/User-navigation'
import styles from '../styles/Home.module.scss'
import variables from '../styles/Variables.module.scss'

interface Days {
  day: number
  dayWeek: number
}

export default function Home() {

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [day, setDay] = useState(0)
  const [days, setDays] = useState<Days[]>([])
  const [time, setTime] = useState("")
  const [avaliableTimes, setAvaliableTimes] = useState([])
  const [sheduleID, setSheduleID] = useState("")
  const [nextMonthDays, setNextMonthDaysm] = useState<any[]>([])
  const [prevMonthDays, setPrevMonthDays] = useState<any[]>([])
  const [hourId, setHourId] = useState("")
  const [themeVar, setThemeVar] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('token')
    const url = window.location.href

    if (!token) {
      window.location.href = '/sign'
    } else {

      fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, requestID: url })
      })
        .then(res => {
          if (res.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/sign'
          }

          return res.json()
        })
        .then(data => {
          localStorage.setItem('refreshToken', data.refreshToken)
        })
    }
  }, [])

  useEffect(() => {
    daysOfmonth(month)
    const theme = localStorage.getItem('theme')
    document.body.classList.add(theme === 'dark' ? 'dark' : 'light-theme')
    setThemeVar(theme === 'dark' ? '#1f1c21' : '#faf7fc')
  }, [])

  const daysOfmonth = (month: number) => {
    const days = new Date(2022, month, 0).getDate()
    setYear(new Date(2022, month, 0).getFullYear())

    const arrDays = []

    for (let i = 1; i <= days; i++) {
      const getDay = new Date(2022, month - 1, i).getDay()
      arrDays.push({ day: i, dayWeek: getDay })
    }

    const nextMonthDaysArr = []
    const prevMonthDaysArr = []

    for (let i = 0; i < 35 - arrDays.length - (arrDays[0].dayWeek || 0); i++) {
      nextMonthDaysArr.push(<span key={i} className={styles.dayNextPrevWeek}>{i + 1}</span>)
    }

    for (let i = 0; i < arrDays[0].dayWeek; i++) {
      const day = new Date(2022, month - 1, 0).getDate()
      prevMonthDaysArr.push(<span key={i} className={styles.dayNextPrevWeek}>{day - i}</span>)
    }

    setNextMonthDaysm(nextMonthDaysArr)
    setPrevMonthDays(prevMonthDaysArr.reverse())
    setDays(arrDays)
  }

  function nextMonth() {

    document.querySelector('#btn-prev')!.classList.remove(styles.disabled)
    document.querySelector(`.${styles.buttons}`)?.classList.add(styles.buttonsEndHide)
    daysOfmonth(month + 1)
    setDay(0)

    const days = document.querySelectorAll('[data-id="span-day"]')

    days.forEach(day => {
      day.classList.remove(styles.selected)
    })

    setMonth(month + 1)
  }

  function prevMonth(e: any) {
    setDay(0)
    document.querySelector(`.${styles.buttons}`)?.classList.add(styles.buttonsEndHide)
    const days = document.querySelectorAll('[data-id="span-day"]')

    days.forEach(day => {
      day.classList.remove(styles.selected)
    })

    const prevDate = new Date(year, month - 1, 1).getTime()
    const initMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()

    if (prevDate === initMonth) {
      document.querySelector('#btn-prev')!.classList.add(styles.disabled)
      return
    }

    daysOfmonth(month - 1)

    setMonth(month - 1)
  }

  function toggleToSchedule() {
    console.log(time)

    const data = {
      time,
      refreshToken: localStorage.getItem('refreshToken'),
      sheduleID
    }

    fetch('/api/insert-new-avaliable-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(data => {
        console.log(data.error)

        if (data.error) {
          toast.error(data.message)
          return
        }

        const span = document.createElement('span')
        span.innerHTML = data.avaliableTime.time
        document.querySelector(`.${styles.shedule}`)!.append(span)

      })
  }

  function setDayToSchedule(day: number, e: any) {
    const days = document.querySelectorAll('[data-id="span-day"]')

    document.querySelectorAll('[data-id="hours"]').forEach(item => {
      item.classList.remove(styles.selected)
      item.classList.remove(styles.deleted)
    })
    document.querySelector(`.${styles.buttons}`)?.classList.add(styles.buttonsEndHide)

    days.forEach(day => {
      day.classList.remove(styles.selected)
    })

    if (new Date(year, month - 1, day) < new Date()) {
      setDay(0)
      return
    }

    setDay(day)
    e.target.classList.add(styles.selected)

    const data = {
      date: new Date(2022, month - 1, day),
      refreshToken: localStorage.getItem('refreshToken')
    }


    console.log(new Date(2022, month - 1, day))


    fetch('/api/insert-new-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(data => {
        setAvaliableTimes(data.schedule.availableTimes)
        setSheduleID(data.schedule.id)
        console.log(data)
      })
  }

  function selectItemForManager(e: any, item: any) {
    document.querySelectorAll('[data-id="hours"]').forEach(item => { item.classList.remove(styles.selected) })
    document.querySelector(`.${styles.buttonsModeration}`)?.classList.remove(styles.buttonsEndHide)
    document.querySelector(`.${styles.container}`)?.classList.add(styles.active)
    e.target.classList.add(styles.selected)

    setHourId(item.id)
    console.log(item.id)
  }

  function closeOverlay() {
    document.querySelectorAll('[data-id="hours"]').forEach(item => { item.classList.remove(styles.selected) })
    document.querySelector(`.${styles.buttonsModeration}`)?.classList.add(styles.buttonsEndHide)
    document.querySelector(`.${styles.container}`)?.classList.remove(styles.active)
    document.querySelector(`.${styles.confirmExclusion}`)?.classList.add(styles.modalHide)
  }

  function confirmExclusion() {

    const data = { hourId, refreshToken: localStorage.getItem('refreshToken') }
    console.log(data)

    fetch('/api/delete-avaliable-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(data => {
        document.querySelector(`#${hourId}`)!.classList.add(styles.deleted)
        setHourId('')
        closeOverlay()
        toast.success('Horário excluído com sucesso!')
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={themeVar} />
      </Head>

      <UserNav />
      <Nav />

      <main>
        <h1 style={{ marginTop: "4rem" }}>Selecione uma data e hora 📆</h1>

        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <span>{new Date(new Date().setMonth(month - 1)).toLocaleDateString('pt-br', { month: 'long' })}</span>

            <div>
              <button onClick={prevMonth} className={styles.disabled} id="btn-prev">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.2188 6.5625L10.7812 15L19.2188 23.4375" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                </svg>
              </button>


              <button onClick={nextMonth} id="btn=next">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.7812 6.5625L19.2188 15L10.7812 23.4375" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.calendarBody}>
            {/* <div className={styles.calendarWeek}> */}
            <span className={styles.weekDay}>Dom</span>
            <span className={styles.weekDay}>Seg</span>
            <span className={styles.weekDay}>Ter</span>
            <span className={styles.weekDay}>Qua</span>
            <span className={styles.weekDay}>Qui</span>
            <span className={styles.weekDay}>Sex</span>
            <span className={styles.weekDay}>Sab</span>
            {/* </div> */}

            {/* <div className={styles.calendarDays}> */}

            {prevMonthDays}

            {days.map((day, index) => (
              new Date(year, month - 1, day.day) < new Date() ? (
                <span key={index} className={styles.passDay}>{day.day} </span>
              ) : (
                <span
                  data-id="span-day"
                  key={index}
                  className={styles.day}
                  onClick={e => setDayToSchedule(day.day, e)}
                >
                  {day.day}
                </span>
              )

            ))}

            {nextMonthDays}

          </div>
        </div>

        {day > 0 && (
          <div className={styles.shedule}>

            <div className={styles.insertNewTime}>
              <input type="time" name="time" id="time" onChange={e => setTime(e.target.value)} />
              <button onClick={toggleToSchedule}>Inserir horário</button>
            </div>

            <h4 id="times-title">Horários disponíveis</h4>

            {avaliableTimes.sort((a: any, b: any) => {
              return a.time > b.time ? 1 : -1
            }).map((item: any, index) => (
              item.available && <span data-id="hours" id={item.id} key={index} onClick={e => selectItemForManager(e, item)}>{item.time}</span>
            ))}
          </div>
        )}

      </main>

      <div className={`${styles.buttonsModeration} ${styles.buttonsEndHide}`}>
        <button>Marcar como agendado</button>
        <button
          onClick={() => {
            document.querySelector(`.${styles.confirmExclusion}`)?.classList.remove(styles.modalHide)
            document.querySelector(`.${styles.buttonsModeration}`)?.classList.add(styles.buttonsEndHide)
          }}>Remover horário</button>
      </div>

      <Footer />

      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className={styles.overlay} onClick={closeOverlay}></div>

      <div className={`${styles.confirmExclusion} ${styles.modalHide}`}>
        <h5>Tem certeza que deseja excluir este horário?</h5>
        <div>
          <button onClick={closeOverlay}>Não</button>
          <button onClick={confirmExclusion}>Sim</button>
        </div>
      </div>
    </div >
  )
}
