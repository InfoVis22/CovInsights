// IMPORTS
import LogoImage from '../../images/Logo.png'
import { Link } from 'react-router-dom'
import './NavBar.scss'

function NavBar() {

    return (
        <div className="NavBar">
            <img src={LogoImage} onClick={() => { navigate('/') }} />
            <h1 className='title'>Insolvenzen während der Corona Pandemie</h1>
            <div className='links'>
                <Link to="dashboard">Dashboard</Link>
                <Link to="about">About</Link>
            </div>
        </div>
    )
}

export default NavBar
