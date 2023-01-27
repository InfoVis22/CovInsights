// IMPORTS
import LogoImage from '../../images/Logo.png'
import { NavLink, useLocation } from 'react-router-dom'
import './NavBar.scss'
import { useAppContext } from '../../contexts/appContext'
import { BsDistributeVertical } from 'react-icons/bs';
import { AiFillSetting, AiOutlineSetting } from 'react-icons/ai';
import { useState } from 'react';
import { Button, Input, Popover, Text } from '@nextui-org/react';


function NavBar() {

    const { verticalLayout, setVerticalLayout, } = useAppContext()
    const [activeSetting, setActiveSetting] = useState(false)
    let location = useLocation();


    return (
        <div className="NavBar">
            <img src={LogoImage} onClick={() => { navigate('/') }} />
            <h1 className='title'>Insolvenzen während der Corona Pandemie</h1>
            <div className='links'>

                {location.pathname === '/dashboard' &&
                    <>
                        <BsDistributeVertical
                            onClick={() => setVerticalLayout(old => !old)}
                            style={{ cursor: "pointer", rotate: verticalLayout ? "90deg" : "0deg", transition: "rotate 0.5s ease-in-out 0s" }}
                        />
                        <Popover placement="bottom-right">
                            <Popover.Trigger>
                                <button>
                                    <AiOutlineSetting
                                        style={{ cursor: "pointer", rotate: activeSetting ? "90deg" : "0deg", transition: "rotate 0.5s ease-in-out 0s" }} />
                                </button>
                            </Popover.Trigger>
                            <Popover.Content>
                                <div className='settingsPopover'>
                                    <h3>Settings</h3>
                                    <Input type="date" label='Min Date' />
                                    <Input type="date" label='Max Date' />
                                </div>
                            </Popover.Content>
                        </Popover>
                    </>
                }




                {location.pathname === '/dashboard' ?
                    <NavLink to="about">About</NavLink> :
                    <NavLink to="dashboard">Dashboard</NavLink>
                }

            </div>
        </div>
    )
}

export default NavBar
