const Navbar = () => {
  return (
    <nav className="flex w-full dark items-center justify-between border-t  border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-linear-to-br from-white to-green-400" />
        <h1 className="text-base font-bold text-white md:text-2xl">FavouriteTracker</h1>
      </div>
      <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </button>
    </nav>
  )
}

export default Navbar   