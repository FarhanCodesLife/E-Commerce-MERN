import React, { useEffect } from 'react'

const App = () => {

  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    console.log('App')
    try {
      const responseUser = fetch('https://localhost:5000/api/user/all').json()
      const responseProduct = fetch('https://localhost:5000/api/product/all').json()
      setUsers(responseUser)
      setProducts(responseProduct)
    } catch (error) {
      console.log(error)
    }
  
  })




  return (
    <div>App</div>
  )
}

export default App