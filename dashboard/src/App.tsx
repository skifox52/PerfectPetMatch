import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import { userContext } from './hooks/userContext';
import type { UserInterface } from './hooks/userContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import ProtectedRoute from './hooks/ProtectAdmin';

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
            <Route path="/auth/signin" element={<SignIn />} />
            <Route element={<DefaultLayout />}>
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute element={<Profile />} />
                  </Suspense>
                }
              />

              <Route
                path="/"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute element={<Users />} />
                  </Suspense>
                }
              />
              <Route
                path="/add-article"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute element={<Article />} />
                  </Suspense>
                }
              />
              <Route
                path="/posts"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute element={<Posts />} />
                  </Suspense>
                }
              />
              <Route
                path="/login"
                element={
                  <Suspense fallback={<Loader />}>
                    <SignIn />
                  </Suspense>
                }
              />
              <Route
                path="/*"
                element={
                  <h1 className="mt-16 text-center text-6xl font-bold">
                    Not found!
                  </h1>
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
