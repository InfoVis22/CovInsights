import './DateControls.scss'
import { useEffect, useState } from 'react'

const DateControls = (props) => {
    
    const handleRest = () => {
        const d = new Date("2018-01-01");
        props.setSelectedDate(d)
    }

    const handlePlay = () => {
        setInterval(() => addADay(), 1000);
    }

    const addADay = () => {

        console.log(d.toString());
        let newd = new Date( props.selectedDate);
        newd.setDate(newd.getDate() + 1);

        props.setSelectedDate(newd);
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
