import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import { userContext } from './hooks/userContext';
import type { UserInterface } from './hooks/userContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const Chart = lazy(() => import('./pages/Chart'));
const FormElements = lazy(() => import('./pages/Form/FormElements'));
const FormLayout = lazy(() => import('./pages/Form/FormLayout'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Tables = lazy(() => import('./pages/Tables'));
const Alerts = lazy(() => import('./pages/UiElements/Alerts'));
const Users = lazy(() => import('./pages/Users'));
const Posts = lazy(() => import('./pages/Posts'));
const Article = lazy(() => import('./pages/Article'));
const Buttons = lazy(() => import('./pages/UiElements/Buttons'));
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface | null>(
    localStorage.getItem('User')!
      ? (JSON.parse(localStorage.getItem('User')!) as UserInterface)
      : null
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    localStorage.setItem(
      'User',
      JSON.stringify({
        _id: '648e305e9a16f00ff528409d',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDhlMzA1ZTlhMTZmMDBmZjUyODQwOWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MDIyNDE3NSwiZXhwIjoyMDUwMjI0MTc1fQ.wneFbnHWqCPYFPPUOb98p0E041zeHbbkm-PDPbDKL-c',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDhlMzA1ZTlhMTZmMDBmZjUyODQwOWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MDIyNDE3NX0.2mMNrsmxoL-orSSUAXN8SBF6BKHE5QhOjhgVHVT-o8o',
        role: 'user',
        profilePicture:
          'http://localhost:5555/assets/ProfilePictures/1687040094037-PofilePicture.jpeg',
      })
    );
  }, []);
  // const role: string | null = (useAuth() && useAuth()!.user?.role) || null;
  const queryClient = new QueryClient();
  const userContextValue = useMemo(() => {
    return { user, setUser };
  }, [user, setUser]);
  return loading ? (
    <Loader />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <userContext.Provider value={userContextValue}>
          <Routes>
            {/* <ProtectAdmin role={role}> */}
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route element={<DefaultLayout />}>
              <Route index element={<ECommerce />} />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<Loader />}>
                    <Profile />
                  </Suspense>
                }
              />
              <Route
                path="/forms/form-elements"
                element={
                  <Suspense fallback={<Loader />}>
                    <FormElements />
                  </Suspense>
                }
              />
              <Route
                path="/users"
                element={
                  <Suspense fallback={<Loader />}>
                    <Users />
                  </Suspense>
                }
              />
              <Route
                path="/add-article"
                element={
                  <Suspense fallback={<Loader />}>
                    <Article />
                  </Suspense>
                }
              />
              <Route
                path="/posts"
                element={
                  <Suspense fallback={<Loader />}>
                    <Posts />
                  </Suspense>
                }
              />
              <Route
                path="/forms/form-layout"
                element={
                  <Suspense fallback={<Loader />}>
                    <FormLayout />
                  </Suspense>
                }
              />
              <Route
                path="/tables"
                element={
                  <Suspense fallback={<Loader />}>
                    <Tables />
                  </Suspense>
                }
              />
              <Route
                path="/settings"
                element={
                  <Suspense fallback={<Loader />}>
                    <Settings />
                  </Suspense>
                }
              />
              <Route
                path="/chart"
                element={
                  <Suspense fallback={<Loader />}>
                    <Chart />
                  </Suspense>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <Suspense fallback={<Loader />}>
                    <Alerts />
                  </Suspense>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <Suspense fallback={<Loader />}>
                    <Buttons />
                  </Suspense>
                }
              />
            </Route>
            {/* </ProtectAdmin> */}
          </Routes>
        </userContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
