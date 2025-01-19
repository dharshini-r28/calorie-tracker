import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './component/Login'
// import Notfound from './component/Notfound'
import Track from './component/Track'
import Private from './component/Private'
import Register from './component/Register'
import { UserContext } from './contexts/UserContext'
import { useEffect, useState } from 'react'
import Plan from './component/Plan'
import CalorieCalculator from './component/CalorieCalculators'
import Chatbot from './component/Chatbot'
import Vizual from './component/Vizual'





const App=()=> {
 
  const [loggedUser,setLoggedUser] 
  = useState(JSON.parse(localStorage.getItem("nutrify-user")));

  

  return (
    <>

    
      <UserContext.Provider value={{loggedUser,setLoggedUser}}>

          <BrowserRouter>   

              <Routes>

                  <Route path='/' element={<Login/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/register' element={<Register/>}/>
                  {/* <Route path='/track' element={<Private Component={Track}/>}/>
                  <Route path='/plan' element={<Private Component={Plan}/>}/> */}
                  <Route path='/track' element={<Track/>}/>
                  <Route path='/plan' element={<Plan/>}/>
                  <Route path="/cal" element={<CalorieCalculator/>}/>
                  {/* <Route path='*' element={<Notfound/>}/> */}
                  <Route path='/chatbot' element={<Chatbot/>}/>
                  {/* <Route path='/viz' element={<Vizual/>}/> */}
              </Routes>
        
            </BrowserRouter>
       

        </UserContext.Provider>

        
    </>
  )
}

export default App