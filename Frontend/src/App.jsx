import { Routes, Route, Link } from 'react-router-dom';
import DisplayPage from './pages/displayPage.jsx';
import RegisterPage from './pages/registerPage.jsx';

import EditPage from './pages/editPage.jsx';
import NavBar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/homePage.jsx';
import LoginPage from './pages/loginPage.jsx';
import RegisterUserPage from './pages/registerUserPage.jsx';
import UsersList from './pages/UsersList.jsx';
import UpdateUser from './pages/UpdateUser.jsx';
import ProtectedRoutes from '../ProtectedRoutes.jsx';
import UserProfile from './pages/UserProfile.jsx';
import CheckInHistory from './pages/CheckInHistory.jsx';
function App() {
  return (

    <div style={{ backgroundColor: ' #f5f5f5', minHeight: '100vh' }} className='flex flex-col min-h-screen '>
      <NavBar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={

            <ProtectedRoutes allowedRoles={['admin', 'staff']}>
              <DisplayPage />
            </ProtectedRoutes>
          }

          />
          <Route path="/customers/register" element={
            <ProtectedRoutes allowedRoles={['admin', 'staff']}>
              <RegisterPage />
            </ProtectedRoutes>
          } />
          <Route path="/customers/editPage/:id" element={

            <ProtectedRoutes allowedRoles={['admin', 'staff']}>
              <EditPage />
            </ProtectedRoutes>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customers/:id/checkInHistory" element={<CheckInHistory />} />
          <Route path='/users/registerUser' element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <RegisterUserPage />
            </ProtectedRoutes>

          }

          />
          <Route path='/users' element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <UsersList />
            </ProtectedRoutes>
          } />
          <Route path='/users/updateUser/:id' element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <UpdateUser />
            </ProtectedRoutes>
          }

          />

          <Route path='/profile' element=
          {
          <ProtectedRoutes allowedRoles={['admin','staff']}>
          <UserProfile />
          </ProtectedRoutes>
            
          } />
        </Routes>



      </div>
      <Footer />
    </div>
  );
}

export default App;
