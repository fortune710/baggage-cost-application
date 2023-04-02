import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/Admin/Dashboard'
import StaffTable from './pages/Admin/StaffTable';


import './App.css'
import LoginPage from './pages/Login';
import { lazy, Suspense } from 'react';
import Loading from './components/Loading';

import AddUserPage from './pages/Admin/CreateUser';
import PaymentsPage from './pages/Admin/Transactions';
import Update from './pages/Admin/Update';
import ViewTransaction from './pages/SeeTransaction';

const UserHome = lazy(() => import('./pages/Home').then(module => ({ default: module.default })))
const CalculateBaggage = lazy(() => import('./pages/Calculate').then(module => ({ default: module.default })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.default })));

function App() {

  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route index path="/" element={<LoginPage/>}/>
        <Route index path="/login" element={<LoginPage/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/home" element={<UserHome/>}/>
        <Route path="/calculate" element={<CalculateBaggage/>} />

        <Route path="/transaction/:id" element={<ViewTransaction/>}/>
        <Route path='/admin' element={<AdminDashboard/>}>
          
          <Route path='users' index element={<StaffTable/>}/>
          <Route path="payments" element={<PaymentsPage/>}/>
          <Route path="add-user" element={<AddUserPage/>} />
          <Route path="update" element={<Update/>} />
        </Route>
      </Routes>
    </Suspense>
      
  )
}

export default App
