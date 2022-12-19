import './DateControls.scss'
import { useEffect, useState } from 'react'

const DateControls = (props) => {


    
    const handleRest = () => {
        const d = new Date("2018-01-01");
        props.setSelectedDate(d)
    }

    const handlePlay = () => {
        const d = new Date("2022-03-25");
        props.setSelectedDate(d)
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
