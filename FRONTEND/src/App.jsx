import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from './Components/Nav'
import Login from './Views/Login'
import Register from './Views/Register'
import ProtectedRoutes from './Components/ProtectedRoutes'
import TasksIndex from "./Views/Tasks/Index";
import UsersIndex from "./Views/Users/Index";
import UsersCreate from "./Views/Users/Create";
import UsersEdit from "./Views/Users/Edit";
import TaskCreate from "./Views/Tasks/Create";
import TaskEdit from "./Views/Tasks/Edit";

function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          {/* Tasks */}
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/tasks" element={<TasksIndex />} />
          <Route path="/tasks/create" element={<TaskCreate />} />
          <Route path="/tasks/edit/:id" element={<TaskEdit />} />
          {/* Users */}
          <Route path="/users" element={<UsersIndex />} />
          <Route path="/users/create" element={<UsersCreate />} />
          <Route path="/users/edit/:id" element={<UsersEdit />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
