
import { cn } from '@/lib/utils'
import HeroSection from '@/components/common/HeroSection';
import './App.css'
import { useEffect, useState } from 'react';
import  { Toaster } from 'react-hot-toast';
import {Routes,Route, Navigate} from 'react-router-dom';
import Login from './pages/Authentication';
function App() {
  const [theme, settheme] = useState(localStorage.getItem("theme") || "dark");
  const token = localStorage.getItem("token")|| ""
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [theme])
  
  return (
    <>
     <Toaster position='top-center'  toastOptions={{ style: theme === 'dark'? { background: '#181818', color: '#fff' , borderRadius: '22px'}: { background: '#fff', color: '#333' , borderRadius: '22px'},
  }} reverseOrder={false} />
      <div className='w-full max-h-full bg-white dark:bg-black '>
        <div className="relative  flex min-h-screen w-full ">
          <div
            className={cn(
              "absolute inset-0",
              "bg-size-[20px_20px]",
              "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:bg-[radial-gradient(#404040_1px,transparent_2px)]",
            )}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black">
          </div>
          <div className=" z-10 w-full">
            <Routes>
              <Route path="/auth" element={token ? <Navigate to="/home" /> : <Login />} />
              <Route path="/home" element={token ? <HeroSection theme={theme} setTheme={settheme} /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to={token! ?  "/auth":"/home"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
