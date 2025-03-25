import { useEffect, useState } from 'react'

const url = 'https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/62616c'

const App = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [displayFlag, setDisplayFlag] = useState<string>('')
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`)
          return
        }

        const reader = response?.body?.getReader()
        if(!reader) return

        let receivedData = ''

        while(true) {
          const { done, value } = await reader.read()
          if(done) break

          const txtDecoder = new TextDecoder()
          const txtChunck = txtDecoder.decode(value)
          receivedData += txtChunck
        }

        setData(receivedData)
        setLoading(false)
      } catch (e) {
        setError(e?.toString() || 'Error')
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if(data.length === 0) return

    if (index < data.length) {
      const timeoutId = setTimeout(() => {
        setDisplayFlag(prevText => prevText + data[index])
        setIndex(prevIndex => prevIndex + 1)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [data, index, displayFlag])

  if(loading) return <div>Loading</div>
  if(error) return <div>{error}</div>

  return (
    <div>
      <div>{displayFlag.split('').map((item:string, idx:number) => (
        <li key={idx}>{item}</li>
      ))}</div>
    </div>
  )
}

export default App
