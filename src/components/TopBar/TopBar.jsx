// IMPORTS
import './TopBar.scss'
import LogoImage from '../../images/Logo.png'
import LogoMobileImage from '../../images/LogoMobile.png'
import { Link } from 'react-router-dom'

function TopBar() {

    return (
        <div className="Topbar">
            <div className="desktop">
                <div className="left">
                    <img
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => {
                            navigate('/')
                        }}
                        className="Logo"
                        src={LogoImage}
                        onClick={() => {
                            navigate('/')
                        }}
                        alt="Logo"
                    />
                    <h1>Insolvenzen während der Corona Pandemie</h1>
                </div>
                <div className="right">
                    <Link to="dashboard">Dashboard</Link>
                    <Link to="about">About</Link>
                </div>
            </div>

            <div className="mobile">
                <img
                    role="button"
                    tabIndex={0}
                    onKeyUp={() => {
                        navigate('/')
                    }}
                    className="LogoMobile"
                    src={LogoMobileImage}
                    onClick={() => {
                        navigate('/')
                    }}
                    alt="LogoMobile"
                />
                <h1>Insolvenzen</h1>
                <div></div>
            </div>
        </div>
    )
}

export default TopBar
