// IMPORTS
import LogoImage from '../../images/Logo.png'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './NavBar.scss'
import { useAppContext } from '../../contexts/appContext'
import { BsDistributeVertical } from 'react-icons/bs';
import { AiOutlineSetting } from 'react-icons/ai';
import { useState } from 'react';
import { Input, Popover } from '@nextui-org/react';
import moment from 'moment';


function NavBar() {

    const { verticalLayout, setVerticalLayout, timeFrame, setTimeFrame } = useAppContext()
    const [activeSetting, setActiveSetting] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();




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
                                    <Input type="date" label='Min Date' value={moment(timeFrame.min).format("YYYY-MM-DD")} onChange={(e) => setTimeFrame(old => ({ ...old, min: new Date(e.target.value ? e.target.value : "2018-01-01") }))} />
                                    <Input type="date" label='Max Date' value={moment(timeFrame.max).format("YYYY-MM-DD")} onChange={(e) => setTimeFrame(old => ({ ...old, max: new Date(e.target.value ? e.target.value : "2023-01-01") }))} />

                                    <h3 style={{ paddingTop: "10px" }}>Shortcuts</h3>
                                    <p> CTRL + SPACE : Play / Pause</p>
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
