import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GlobalContext from '../context/GlobalContext'
import LoginModal from "./LoginModal";



const Nav = () => {

  const [isOpen, setIsOpen] = React.useState(false)

  const { openModal, setOpenModal,session, logout} = useContext(GlobalContext)

  useEffect(() => {
    const mobileMenu = document.getElementById('mobile-menu')
    if (mobileMenu) {
      if (isOpen) {
        mobileMenu.style.display = 'block'
      } else {
        mobileMenu.style.display = 'none'
      }
    }
  }, [isOpen])
  return (
    <nav className="bg-white">
      
        
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 justify-between">
        <div className="flex">
          <div className="-ml-2 mr-2 flex items-center md:hidden">
            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false" onClick={()=>setIsOpen(!isOpen)}>
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center">
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          </div>
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <Link to="/" className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900">Discover</Link>
            <Link to="/categories" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Categories</Link>
            {session && (
              <>

            <Link to="/reviews" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Reviews</Link>
            <Link to="/upgrades" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Upgrades</Link>

              </>
            )}
            </div>

        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            
            {
              session ? <Link to="/" onClick={logout} type="button" className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Logout
            </Link>
            :
            <button onClick={() => setOpenModal(!openModal)} className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              🚀
              Get Started
            </button>
            }
            
          </div>
        </div>
      </div>
    </div>
  
    <div className="md:hidden" id="mobile-menu">
      <div className="space-y-1 pb-3 pt-2">
        {session && (
          <>
           <Link to="/reviews" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Reviews</Link>
        <Link to="/upgrades" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Upgrades</Link>
          </>
        )}
        <Link to="/" className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700 sm:pl-5 sm:pr-6">Discover</Link>
        <Link to="/categories" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Categories</Link>
       
      </div>
    </div>
    
  
    
  </nav>
  )
}

export default Nav