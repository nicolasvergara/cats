import { useState, useEffect } from 'react'
import './App.css'

function App () {
  const [text, setText] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)

  const getCatFact = async () => {
    try {
      const response = await fetch('https://meowfacts.herokuapp.com/')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setText(data.data[0])
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error)
    }
  }

  const getCatPic = async () => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setUrl(data[0].url)
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error)
    }
  }

  const ImageComponent = ({ imageUrl }) => {
    return (
      <div
        style={{
          width: '400px',
          height: '400px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <img
          src={imageUrl}
          alt='Cat'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  const handleReloadClick = () => {
    if (navigator.onLine) {
      setIsOnline(true)
      getCatFact()
      getCatPic()
    } else {
      setIsOnline(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([getCatFact(), getCatPic()])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#040404',
        color: 'white',
        fontFamily: 'Courier, monospace',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='card' style={{ textAlign: 'center' }}>
          <p>{text}</p>
          <ImageComponent imageUrl={url} />
          <img
            id='reload-icon'
            src='/reload.png'
            alt='Refresh'
            onClick={handleReloadClick}
            style={{
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              marginTop: '15px',
              filter: isOnline ? '' : 'grayscale(1) opacity(0.2)'
            }}
          />
          <p>{isOnline ? '' : 'No internet'}</p>
        </div>
      )}
    </div>
  )
}

export default App
