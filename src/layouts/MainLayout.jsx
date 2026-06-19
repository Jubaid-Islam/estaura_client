import { Outlet } from 'react-router'
import Navbar from '../components/home/navbar/Navbar'
import Footer from '../components/home/footer/Footer'
import ScrollToTop from '../shared/ScrollToTop'


const MainLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <ScrollToTop/>
      <Navbar></Navbar>
      <div className='flex-1'>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
