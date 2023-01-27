// IMPORTS
import LogoImage from '../../images/Logo.png'
import { Link } from 'react-router-dom'
import './NavBar.scss'
import { useAppContext } from '../../contexts/appContext'

function NavBar() {

    const { verticalLayout, setVerticalLayout, } = useAppContext()

    return (
        <div className="NavBar">
            <img src={LogoImage} onClick={() => { navigate('/') }} />
            <h1 className='title'>Insolvenzen während der Corona Pandemie</h1>
            <div className='links'>
                <p onClick={() => setVerticalLayout(old => !old)} style={{ cursor: "pointer", textDecoration: "underline" }}>Toggle Layout</p>
                <Link to="dashboard">Dashboard</Link>
                <Link to="about">About</Link>
            </div>
        </div>
    )
}

export default NavBar
