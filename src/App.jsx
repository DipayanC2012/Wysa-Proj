import './App.scss'
import Home from './components/Home/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login/Login'

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/home/:username',
      element: <Home />
    }
  ])

  return <RouterProvider router={router} />
}

export default App
