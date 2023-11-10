import {
  Routes,
  Route,
} from 'react-router-dom';


import Layout from './components/Layout';
import SignIn from './features/auth/Login/SignIn';

import SignUp from './features/auth/Login/SignUp';
import UserInfos from './features/users/UserInfos';
import DashLayout from './components/DashLayout';
import PersistLogin from './features/auth/PersistLogin';
import TeacherInfos from './features/teachers/TeacherInfos';


function App() {

    return(
          <Routes>
            <Route path="/" element={<Layout/>}>

              <Route index element={<SignIn />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="ANCADMINsignup" element={<SignUp />} />

              <Route element={<PersistLogin />}>
              
                <Route path='users'>
                  <Route index element={<DashLayout />} />
                  <Route path=':id' element={<UserInfos />} />
                </Route>

                <Route path='teacher'>
                  <Route index element={<DashLayout />} />
                  <Route path=':id' element={<TeacherInfos />} />

                </Route>
              </Route>
              {/* <Route path='teacher' element={<TeacherDashboard/>} /> */}
            </Route>

          </Routes>
    )
  }

export default App;
