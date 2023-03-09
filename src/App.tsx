import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/Admin/Dashboard'
import StaffTable from './pages/Admin/StaffTable';


import './App.css'
import LoginPage from './pages/Login';
import { lazy, Suspense } from 'react';
import Loading from './components/Loading';
import UserHome from './pages/Home';
import CalculateBaggage from './pages/Calculate';
import AddUserPage from './pages/Admin/CreateUser';
import PaymentsPage from './pages/Admin/Transactions';
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.default })));

function App() {

  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route index path="/login" element={<LoginPage/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/home" element={<UserHome/>}/>
        <Route path="/calculate" element={<CalculateBaggage/>} />

        <Route path='/admin' element={<AdminDashboard/>}>
          <Route path='users' index element={<StaffTable/>}/>
          <Route path="payments" element={<PaymentsPage/>}/>
          <Route path="update" element={<h2>hello</h2>} />
          <Route path="add-user" element={<AddUserPage/>} />
        </Route>
      </Routes>
    </Suspense>
      
  )
}

export default App
