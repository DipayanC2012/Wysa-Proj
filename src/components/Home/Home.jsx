import { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { CgProfile } from 'react-icons/cg'
import Modal from '../Modal/Modal'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { BASE_API } from '../../API'

const MESSAGES = [
  'Hi there!👋',
  "I'm Wysa - an AI chatbot built by therapists.",
  "I'm here to understand your concerns and connect you with the best resources available to support you.",
  'Can I help?'
]

let interval = null

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [index, setIndex] = useState()
  const [userId, setUserId] = useState()
  const [themes, setThemes] = useState()
  const [messages, setMessages] = useState([])
  const [messageCount, setMessageCount] = useState(0)
  const { username } = useParams()

  const themesValueArray = themes && Object.values(themes)

  useEffect(() => {
    interval = setInterval(() => {
      setMessageCount((prev) => prev + 1)
      const newMessageArray = [...messages, MESSAGES[messageCount]]
      setMessages(newMessageArray)
    }, 1000)
    if (messageCount >= MESSAGES.length) clearInterval(interval)

    return () => {
      clearInterval(interval)
    }
  }, [messageCount, messages])

  useEffect(() => {
    const themeIndex = localStorage.getItem('theme-index')

    if (!themeIndex || themeIndex > themesValueArray?.length - 1) {
      setIndex(0)
      localStorage.setItem('theme-index', 0)
      return
    }

    setIndex(Number(themeIndex))
  }, [username, themesValueArray])

  //Fetch current user data
  useEffect(() => {
    axios.get(`${BASE_API}/${username}.json`).then((res) => {
      const data = res.data
      const id = Object.keys(data)[0]
      setUserId(id)
    })
  }, [username])

  //Fetch current users theme
  useEffect(() => {
    axios
      .get(`${BASE_API}/${username}/${userId}/themes.json`)
      .then((res) => setThemes(res.data))
      .catch((err) => console.log(err))
  }, [isModalOpen, userId, username])

  const themeChangeHandler = (e) => {
    const idx = e.target.value
    localStorage.setItem('theme-index', idx)
    setIndex(idx)
  }

  return (
    <div
      className={styles.bg}
      style={{
        background: themes && themesValueArray[index]?.background
      }}
    >
      <div className={styles.switchComponent}>
        <label htmlFor='colorProfiles'>Select Component</label>

        <div className={styles.dropDown}>
          <select
            name='colorProfiles'
            value={index}
            onChange={themeChangeHandler}
          >
            {themesValueArray &&
              themesValueArray.map((ele, idx) => (
                <option key={ele.name} value={idx}>
                  {ele.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className={styles.homeContainer}>
        {isModalOpen && (
          <Modal
            setIsModalOpen={setIsModalOpen}
            userId={userId}
            username={username}
          />
        )}
        <div className={styles.profileIcon}>
          <CgProfile onClick={() => setIsModalOpen(true)} />
        </div>
        <div className={styles.chatContainer}>
          {messages.map((ele, idx) => (
            <div
              key={idx}
              className={styles.chatBubble}
              style={{
                backgroundColor: themes && themesValueArray[index]?.bubble,
                color: themes && themesValueArray[index]?.text
              }}
            >
              {ele}
            </div>
          ))}
        </div>
        <form
          className={styles.inputField}
          style={{
            backgroundColor: themes && themesValueArray[index]?.bubble,
            color: themes && themesValueArray[index]?.text
          }}
        >
          <input
            className={styles.textArea}
            type='text'
            placeholder='Type your message'
          />
        </form>
      </div>
    </div>
  )
}

export default Home
