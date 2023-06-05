import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { createPortal } from 'react-dom'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import axios from 'axios'
import { BASE_API } from '../../API'

const Modal = ({ setIsModalOpen, userId, username }) => {
  const [allThemes, setAllThemes] = useState({
    name: '',
    background: '',
    bubble: '',
    text: ''
  })

  const [imageUrl, setImageUrl] = useState()

  const handleThemeChange = (e) => {
    const { name, value } = e.target
    setAllThemes({
      ...allThemes,
      [name]: value
    })
  }

  React.useEffect(() => {
    function handleEscapeKey(e) {
      if (e.keyCode === 27) {
        setIsModalOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [setIsModalOpen])

  //Fetch the current profile image url
  useEffect(() => {
    axios
      .get(`${BASE_API}/${username}/${userId}/profilePic.json`)
      .then((res) => setImageUrl(res.data))
      .catch((err) => console.log(err))
  }, [username, userId])

  const updateUserData = (e) => {
    e.preventDefault()
    const { name, background, text, bubble } = allThemes ?? {}
    axios
      .patch(`${BASE_API}/${username}/${userId}/themes/${name}.json`, {
        name,
        background,
        text,
        bubble
      })
      .catch((err) => console.log(err))
  }

  //Uplaod the image url to firebase
  const uploadImageHandler = () => {
    axios
      .patch(`${BASE_API}/${username}/${userId}/.json`, {
        profilePic: imageUrl
      })
      .catch((err) => console.log(err))
  }

  return createPortal(
    <>
      <div
        className={styles.modalBackdrop}
        onClick={() => setIsModalOpen(false)}
      ></div>
      <div className={styles.modalWrapper}>
        <div
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
        >
          <AiOutlineCloseCircle />
        </div>

        {imageUrl ? (
          <img src={imageUrl} alt='profile' className={styles.profilePic} />
        ) : (
          <div className={styles.profilePic} />
        )}
        <input
          type='text'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className={styles.profilePicButton} onClick={uploadImageHandler}>
          Upload Picture
        </div>
        <form className={styles.themesConatiner} onSubmit={updateUserData}>
          <div className={styles.specifications}>
            <label htmlFor='name'>Name of theme</label>
            <input
              id='name'
              type='text'
              name='name'
              onChange={handleThemeChange}
              value={allThemes.name}
            />
          </div>
          <div className={styles.specifications}>
            <label htmlFor='backgroundTheme'>Background theme</label>
            <input
              id='backgroundTheme'
              type='color'
              name='background'
              value={allThemes.background}
              onChange={handleThemeChange}
            />
          </div>

          <div className={styles.specifications}>
            <label htmlFor='bubbleTheme'>Bubble theme</label>
            <input
              name='bubble'
              id='bubbleTheme'
              type='color'
              onChange={handleThemeChange}
              value={allThemes.bubble}
            />
          </div>
          <div className={styles.specifications}>
            <label htmlFor='textTheme'>Text theme</label>
            <input
              id='textTheme'
              type='color'
              value={allThemes.text}
              name='text'
              onChange={handleThemeChange}
            />
          </div>
          <div className={styles.bottomSection}>
            <button
              className={styles.cancelButton}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type='submit' className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </>,
    document.getElementById('modal')
  )
}

export default Modal
