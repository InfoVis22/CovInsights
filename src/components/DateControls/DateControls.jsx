import './DateControls.scss'
import { useEffect, useState } from 'react'

const DateControls = (props) => {
    
 
    const [playInterval, setplayInterval] = useState()

    const handleRest = () => {
        const d = new Date("2018-01-01");
        props.setSelectedDate(d)
    }

    const handlePlay = () => {
        const id = setInterval(() => addADay(), 1000);
        setplayInterval(id)
    }

    const addADay = () => {
        let newdate = new Date(props.selectedDate);
        newdate.setDate(newdate.getDate() + 1);
        props.setSelectedDate(newdate);
    }

    const handlePause = () => {
        clearInterval(playInterval);
    }
    return (
        <div className="DateControls">
                <p>Date: {props.selectedDate.toString()}</p>
                <button onClick={() => handlePlay()}>Play</button>
                <button  onClick={() => handlePause()}>Pause</button>
                <button  onClick={() => handleRest()}>Rest</button>
        </div>
    )
}

export default DateControls
