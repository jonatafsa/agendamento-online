import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Footer from "../components/Footer"
import Nav from "../components/Nav"
import styles from '../styles/Home.module.scss'

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/adventurer-neutral';

interface Days {
  day: number
  dayWeek: number
}

interface SchedProps {
  date: string
  id: string
  availableTimes: {
    time: string
    id: string
    avaliable: boolean
    length: number
  }
}

interface SheduleProps {
  name: string
  job: string
  jobTime: string
  price: string
  schedule: any
  schedules: SchedProps
}

export default function User() {

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [day, setDay] = useState(0)
  const [days, setDays] = useState<Days[]>([])
  const [avaliableTimes, setAvaliableTimes] = useState([])
  const [sheduleID, setSheduleID] = useState("")
  const [nextMonthDays, setNextMonthDaysm] = useState<any[]>([])
  const [prevMonthDays, setPrevMonthDays] = useState<any[]>([])
  const [hourId, setHourId] = useState("")
  const [data, setData] = useState({} as SheduleProps)
  const [spanDay, setSpanDay] = useState<any[]>([])
  const [themeVar, setThemeVar] = useState("")

  useEffect(() => {
    //get url param
    const param = window.location.pathname.split("/")[1]

    // This is where you would fetch the data from the API
    fetch(`/api/get-shedule?user=${param}`, { cache: 'no-cache' })
      .then((res) => res.json())
      .then((data) => {
        // Do something with the data
        setData(data.schedules)
      })
  }, [])

  useEffect(() => {
    daysOfmonth(month)
    const theme = localStorage.getItem('theme')
    document.body.classList.add(theme === 'dark' ? 'dark' : 'light-theme')
    setThemeVar(theme === 'dark' ? '#1f1c21' : '#faf7fc')
  }, [data])

  //Função que inicia os dias do mês no calendario
  const daysOfmonth = async (month: number) => {
    // Constante que recebe a quantidade de dias no mês
    const days = new Date(2022, month, 0).getDate()
    // Define o ano na variável de estado
    setYear(new Date(2022, month, 0).getFullYear())

    // Inicia uma constante vazia que receberá os dias no mês
    const arrDays = []
    // Constante que guarda os dias do mês para ser exibido
    const spanDay: any = []

    // Laço de repetição que pega guarda os dias no mês
    for (let i = 1; i <= days; i++) {

      // Constante que guarda o dia da semana do dia do mes
      const getDay = new Date(2022, month - 1, i).getDay()

      const date = new Date(year, month - 1, i)

      const schedules: SchedProps[] = Object.values(data.schedules || []).filter((item: any) => {
        return new Date(item.date).getTime() === date.getTime()
      })

      if (schedules.length > 0) {

        if (new Date(year, month - 1, i) < new Date()) {
          spanDay.push(<span key={i} className={styles.passDay}>{i}</span>)
          // Insere dentro da constante criada acima o dia da semana e o dia do mês
          arrDays.push({ day: i, dayWeek: getDay })
        } else {


          if (schedules[0].availableTimes.length > 0) {

            const timesAvailable = Object.values(schedules[0].availableTimes).filter((item: any) => {
              return item.available === true
            })

            if (timesAvailable.length > 0) {
              spanDay.push(<span
                key={i}
                className={styles.day}
                data-id="span-day"
                onClick={e => setDayToSchedule(i, e, schedules[0].availableTimes)}>{i}</span>)
              // Insere dentro da constante criada acima o dia da semana e o dia do mês
              arrDays.push({ day: i, dayWeek: getDay, availableTimes: schedules[0].availableTimes })
            } else {
              spanDay.push(<span key={i} className={styles.passDay}>{i}</span>)
              // Insere dentro da constante criada acima o dia da semana e o dia do mês
              arrDays.push({ day: i, dayWeek: getDay })
            }


          } else {
            spanDay.push(<span key={i} className={styles.passDay}>{i}</span>)
            // Insere dentro da constante criada acima o dia da semana e o dia do mês
            arrDays.push({ day: i, dayWeek: getDay })
          }

        }
      } else {
        spanDay.push(<span key={i} className={styles.passDay}>{i}</span>)
        // Insere dentro da constante criada acima o dia da semana e o dia do mês
        arrDays.push({ day: i, dayWeek: getDay })
      }

    }

    console.log(arrDays)

    // Constante que guarda os dias do mês anterior
    const nextMonthDaysArr = []
    // Constante que guarda os dias do mês posterior
    const prevMonthDaysArr = []
    // Constante que guarda a quantidade de dias que tem o mês
    const daysArrLength = arrDays.length - 1

    // Laço de repetição que pega guarda os dias no mês posterior
    for (let i = 0; i < (6 - arrDays[daysArrLength].dayWeek); i++) {
      nextMonthDaysArr.push(<span key={i} className={styles.dayNextPrevWeek}>{i + 1}</span>)
    }

    // for (let i = 0; i < arrDays.length; i++) {
    //   daysArr.push(<span key={i} className={styles.dayWeek}>{arrDays[i].day}</span>)
    // }

    // Laço de repetição que pega guarda os dias no mês anterior
    for (let i = 0; i < arrDays[0].dayWeek; i++) {
      const day = new Date(2022, month - 1, 0).getDate()
      prevMonthDaysArr.push(<span key={i} className={styles.dayNextPrevWeek}>{day - i}</span>)
    }

    // Insere na variável de estados os dias do mês posterior
    setNextMonthDaysm(nextMonthDaysArr)
    // Insere na variável de estados os dias do mês anterior
    setPrevMonthDays(prevMonthDaysArr.reverse())
    // Insere na variável de estados os dias do mês
    setDays(arrDays)
    setSpanDay(spanDay)
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

    if (month === 12) {
      setMonth(1)
    }

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

    if (month === 1) {
      setMonth(12)
    }

    setMonth(month - 1)
  }

  function setDayToSchedule(day: number, e: any, shedule: any) {
    document.querySelectorAll('[data-id="span-day"]').forEach(day => {
      day.classList.remove(styles.selected)
    })

    document.querySelectorAll('[data-id="hours"]').forEach(item => {
      item.classList.remove(styles.selected)
      item.classList.remove(styles.deleted)
    })
    document.querySelector(`.${styles.buttons}`)?.classList.add(styles.buttonsEndHide)

    e.target.classList.add(styles.selected)

    setDay(day)
    setAvaliableTimes(shedule)
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
    document.querySelector(`.${styles.makeAppointment}`)?.classList.add(styles.modalHide)
  }

  function toggleInsertAppointment(e: any) {
    e.preventDefault()

    //get data from input form
    const name = document.querySelector('#name') as HTMLInputElement
    const email = document.querySelector('#mail') as HTMLInputElement
    const phone = document.querySelector('#phone') as HTMLInputElement
    const memo = document.querySelector('#memo') as HTMLInputElement

    const data = {
      id: hourId,
      name: name.value,
      email: email.value,
      phone: phone.value,
      memo: memo.value
    }

    console.log(data)

    fetch('/api/insert-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)

        if (data.code === 401) {
          toast.error(data.message)
          closeOverlay()
          return
        }

        toast.success(data.message)
        closeOverlay()
      })
  }

  const getVariant = (i: number) => {
    const variant = String(Math.floor(Math.random() * i + 1))
    return [`variant${variant}`]
  }

  let avatar = createAvatar(style, {
    seed: 'custom-seed',
    // ... and other options
    dataUri: true,
    mouth: getVariant(30),
    eyebrows: getVariant(10),
    eyes: getVariant(26),
    // backgroundColor: getVariant(5),
  });

  return (
    <div className={styles.container}>
      <Nav />

      <main>
        <h1>Selecione uma data e hora 📆</h1>

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

            {spanDay}

            {/* {days.map((day, index) => (
              new Date(year, month - 1, day.day) < new Date() ? (
                <span key={index} className={styles.passDay}>{day.day} </span>
              ) : (
                getDayOfWeek(day.day, index)
              )

            ))} */}

            {nextMonthDays}

          </div>
        </div>

        {day > 0 && (
          <div className={styles.shedule}>
            <h4 id="times-title" style={{ marginTop: '30px' }}>Horários disponíveis</h4>

            {avaliableTimes.sort((a: any, b: any) => {
              return a.time > b.time ? 1 : -1
            }).map((item: any, index) => (
              item.available && <span data-id="hours" id={item.id} key={index} onClick={e => selectItemForManager(e, item)}>{item.time}</span>
            ))}
          </div>
        )}

      </main>

      <div className={`${styles.buttonsModeration} ${styles.buttonsEndHide}`}>
        <button
          onClick={() => {
            document.querySelector(`.${styles.makeAppointment}`)?.classList.remove(styles.modalHide)
            document.querySelector(`.${styles.buttonsModeration}`)?.classList.add(styles.buttonsEndHide)
          }}
        >Marcar horário</button>
      </div>

      <Footer />

      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className={styles.overlay} onClick={closeOverlay}></div>

      <div className={`${styles.makeAppointment} ${styles.modalHide}`}>
        <h5>Insira seus dados</h5>
        <form onSubmit={toggleInsertAppointment}>
          <div className={`${styles.formItem} ${styles.avatar}`}>
            <label htmlFor="avatar">Um foto sua</label>
            <input type="file" id="avatar" />
            <img src={avatar} alt="avatar" />
          </div>

          <div className={styles.formItem}>
            <label>Seu nome</label>
            <input type="text" placeholder="Nome" id="name" />
          </div>

          <div className={styles.formItem}>
            <label>Telefone para contato</label>
            <input type="text" placeholder="Telefone" id="phone" />
          </div>

          <div className={styles.formItem}>
            <label>Seu E-mail</label>
            <input type="text" placeholder="E-mail" id="mail" />
            <span>* Opcional</span>
          </div>

          <div className={styles.formItem}>
            <label>Observações</label>
            <textarea placeholder="Observações" id="memo" />
            <span>* Opcional</span>
          </div>

          <div className={styles.formButtons}>
            <button type="button" onClick={closeOverlay}>Cancelar</button>
            <button type="submit">Marcar horário</button>
          </div>
        </form>

      </div>
    </div>
  )
}