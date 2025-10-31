
import { motion } from "motion/react";
import TrackerNavbar from "./TrackerNavbar";
import TableComponent from "./Table";
import DialogDemo from "./DailogBox";


export function HeroSection({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
  return (
    <>
      <TrackerNavbar theme={theme} setTheme={setTheme} />
    <div className=" mx-auto overflow-hidden my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px " />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px " />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 " />
      </div>
      <div className="px-4 py-5 md:py-15">
        <h1 className="relative z-10 mx-auto max-w-4xl max-sm:w-6/12 max-md:w-9/12 text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Track Your Favorite Movies & TV Shows Effortlessly"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-md:w-9/12 max-sm:w-6/12 max-w-4xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        > 
        FavoriteTracker helps you organize, explore, and keep tabs on all your
        favorite shows and films — from timeless classics to the latest releases.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative max-sm:w-6/12 z-10 mt-8 mx-auto flex max-md:w-9/12 flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Now
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 mx-auto max-md:w-[60%] max-sm:w-[50%] rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div>
            <TableComponent />
          <DialogDemo />
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
export default HeroSection;