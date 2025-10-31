
import { cn } from '@/lib/utils'
import HeroSection from '@/components/common/HeroSection';
import './App.css'

function App() {

  return (
    <>
    <div className='w-full dark max-h-full bg-white dark:bg-black '>
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
        <HeroSection />
      </div>  
      </div>
    </div>
    </>
  )
}

export default App
