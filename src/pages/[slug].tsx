import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Footer from "../components/Footer"
import Nav from "../components/Nav"
import styles from '../styles/Home.module.scss'

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/adventurer-neutral';
import Head from "next/head"
import Image from "next/image"
import { PriceMask } from "../services/masks"

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
  avatar: string
  username: string
  address: string
  description: string
  schedules: SchedProps
}

export default function User() {

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [day, setDay] = useState(0)
  const [days, setDays] = useState<Days[]>([])
  const [avaliableTimes, setAvaliableTimes] = useState([])
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
        console.log(data)
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

    const body = document.querySelector('body')
    setTimeout(() => {
      window.scrollTo(0, body!.scrollHeight)
    }, 300)
  }

  function selectItemForManager(e: any, item: any) {
    document.querySelectorAll('[data-id="hours"]').forEach(item => { item.classList.remove(styles.selected) })
    document.querySelector(`.${styles.buttonsModeration}`)?.classList.remove(styles.buttonsEndHide)
    document.querySelector(`.${styles.container}`)?.classList.add(styles.active)
    e.target.classList.add(styles.selected)

    setHourId(item.id)
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


    fetch('/api/insert-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {

        if (data.code === 401) {
          toast.error(data.message)
          closeOverlay()
          return
        }

        toast.success(data.message)
        closeOverlay()
      })
  }

  let avatar = createAvatar(style, { dataUri: true })

  return (
    <div className={styles.container}>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#9c33ff" />
      </Head>

      <Nav />

      <main>

        <div className={styles.userDetails}>
          <h1 className="heading">{data.name}</h1>

          <div className={styles.avatar}>
            {!data.avatar ? (
              <img src={avatar} alt={data.name} />
            ) : (
              <Image src={data.avatar} width={1024} height={1024} alt={data.name} />
              // <img src={data.avatar} alt={data.name} />
            )}
          </div>

          <p className={styles.username}>{data.username}</p>

          <p className={styles.job}>{data.job}</p>

          {data.jobTime && (
            <p className={styles.jobTime}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 0.8125C6.26934 0.8125 0.8125 6.26934 0.8125 13C0.8125 19.7201 6.28047 25.1875 13 25.1875C19.7301 25.1875 25.1875 19.7301 25.1875 13C25.1875 6.27988 19.7201 0.8125 13 0.8125ZM19.3281 14.875H12.2969C12.2347 14.875 12.1751 14.8503 12.1311 14.8064C12.0872 14.7624 12.0625 14.7028 12.0625 14.6406V4.79688C12.0625 4.73471 12.0872 4.6751 12.1311 4.63115C12.1751 4.58719 12.2347 4.5625 12.2969 4.5625H13.7031C13.7653 4.5625 13.8249 4.58719 13.8689 4.63115C13.9128 4.6751 13.9375 4.73471 13.9375 4.79688V13H19.3281C19.3903 13 19.4499 13.0247 19.4939 13.0686C19.5378 13.1126 19.5625 13.1722 19.5625 13.2344V14.6406C19.5625 14.7028 19.5378 14.7624 19.4939 14.8064C19.4499 14.8503 19.3903 14.875 19.3281 14.875Z" fill="#515151" />
              </svg>
              {data.jobTime} <b>(estimado)</b>
            </p>
          )}

          {data.address && (
            <p className={styles.jobLocal}>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.49746 17.835L19.0072 10.4725C20.3309 9.88222 20.3309 8.11779 19.0072 7.52746L2.49746 0.16496C1.00163 -0.502106 -0.549937 0.979138 0.190994 2.36689L3.34302 8.27061C3.58817 8.72977 3.58818 9.27023 3.34302 9.72939L0.190994 15.6331C-0.549935 17.0209 1.00163 18.5021 2.49746 17.835Z" fill="#515151" />
              </svg>
              {data.address}
            </p>
          )}

          {data.price && (
            <p className={styles.jobPrice}>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.875 18.0312C0.875 18.9015 1.2207 19.7361 1.83606 20.3514C2.45141 20.9668 3.28601 21.3125 4.15625 21.3125H23.8438C24.714 21.3125 25.5486 20.9668 26.1639 20.3514C26.7793 19.7361 27.125 18.9015 27.125 18.0312V9.00781H0.875V18.0312ZM4.74219 13.5781C4.74219 13.1119 4.92738 12.6648 5.25704 12.3352C5.58669 12.0055 6.0338 11.8203 6.5 11.8203H9.3125C9.7787 11.8203 10.2258 12.0055 10.5555 12.3352C10.8851 12.6648 11.0703 13.1119 11.0703 13.5781V14.75C11.0703 15.2162 10.8851 15.6633 10.5555 15.993C10.2258 16.3226 9.7787 16.5078 9.3125 16.5078H6.5C6.0338 16.5078 5.58669 16.3226 5.25704 15.993C4.92738 15.6633 4.74219 15.2162 4.74219 14.75V13.5781ZM23.8438 0.6875H4.15625C3.28601 0.6875 2.45141 1.0332 1.83606 1.64856C1.2207 2.26391 0.875 3.09851 0.875 3.96875V5.49219H27.125V3.96875C27.125 3.09851 26.7793 2.26391 26.1639 1.64856C25.5486 1.0332 24.714 0.6875 23.8438 0.6875Z" fill="#515151" />
              </svg>
              {PriceMask(data.price)}
            </p>
          )}

          {data.description && (
            <p className={styles.description}>{data.description}</p>
          )}
        </div>

        <div className={styles.calendar}>

          <h1>Selecione uma data e hora 📆</h1>


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

            <span className={styles.weekDay}>Dom</span>
            <span className={styles.weekDay}>Seg</span>
            <span className={styles.weekDay}>Ter</span>
            <span className={styles.weekDay}>Qua</span>
            <span className={styles.weekDay}>Qui</span>
            <span className={styles.weekDay}>Sex</span>
            <span className={styles.weekDay}>Sab</span>

            {prevMonthDays}

            {spanDay}

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