
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'

/* pages */
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyProperties from './components/pages/Property/MyProperties'
import AddProperty from './components/pages/Property/AddProperty'
import EditProperty from './components/pages/Property/EditProperty'
import PropertyDetails from './components/pages/Property/PropertyDetails'
import MyNegotiations from './components/pages/Property/MyNegotiations'

/* context */
import { UserProvider } from './context/UserContext'


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/property/myproperties' element={<MyProperties />} />
            <Route path='/property/add' element={<AddProperty />} />
            <Route path='/property/edit/:id' element={<EditProperty />} />
            <Route path='/property/mynegotiations' element={<MyNegotiations />} />
            <Route path='/property/:id' element={<PropertyDetails />} /> 
            <Route path='/' element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
