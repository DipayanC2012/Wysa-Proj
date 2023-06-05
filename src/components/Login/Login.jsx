import React from 'react'
import { AiOutlineUser, AiOutlineEye } from 'react-icons/ai'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_API } from '../../API'

const Login = () => {
  const navigate = useNavigate()

  /*User data state*/
  const [user, setUser] = React.useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = React.useState(false)

  /*Handle input change and checkbox*/
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    type === 'checkbox'
      ? setUser({ ...user, [name]: checked })
      : setUser({ ...user, [name]: value })
  }

  /*Change password visibility*/
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  // If user doesnt exists then post the user data
  const postNewUser = () => {
    const { username } = user ?? {}
    axios
      .post(`${BASE_API}/${user.username}.json`, {
        username,
        themes: {
          default: {
            name: 'default',
            background:
              'linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%)',
            bubble: '#fff',
            text: '#000000'
          }
        }
      })
      .catch((err) => console.log(err))
  }

  /*Handle form submit*/
  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .get(`${BASE_API}/${user.username}.json`)
      .then((res) => {
        if (!res.data) {
          postNewUser()
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        navigate('/home/' + user.username)
      })
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <img
          className={styles.loginImage}
          src='https://i.postimg.cc/VsXKQ7LW/lkrnur2a-PLw-SVEgv-DARDn2-OPBFnd-VPV9605-WA0-Q7.png'
        />
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formLabel}>
            <label htmlFor='username'>Username </label>
            <div className={styles.formInputContainer}>
              <input
                type='text'
                placeholder='Enter your username'
                className={styles.formInput}
                name='username'
                id='username'
                value={user.username}
                onChange={handleChange}
                autoComplete='on'
                required
              />
              <AiOutlineUser />
            </div>
          </div>
          <div className={styles.formLabel}>
            <label htmlFor='password'>Password</label>

            <div className={styles.formInputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                className={styles.formInput}
                name='password'
                id='password'
                value={user.password}
                onChange={handleChange}
                autoComplete='off'
              />
              <AiOutlineEye
                className={styles.formIcon}
                onClick={handleShowPassword}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
          <div className={styles.bottomSection}>
            <label htmlFor='rememberMe' className={styles.rememberMeSection}>
              <input
                type='checkbox'
                name='rememberMe'
                id='rememberMe'
                checked={user.rememberMe}
                onChange={handleChange}
              />
              <p>Remember Me</p>
            </label>
            <h4 className={styles.forgotPassword}>Forgot Password?</h4>
          </div>
          <button type='submit' className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
