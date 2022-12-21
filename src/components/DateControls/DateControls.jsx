import './DateControls.scss'
import { useEffect, useState, useRef } from 'react'

const DateControls = (props) => {
    
    let timer
    const [count, setCount] = useState(0)
    const [isPlaying, setPlaying] = useState(false)
    
    const updateCount = () => {
      timer = !timer && setInterval(() => {
        setCount(prevCount => prevCount + 1)
      }, 100)

      //Limit of five years in days
      //if (count === 1835) clearInterval(timer)
    }
    
    useEffect(() => {
        if(isPlaying){
            updateCount()

            //Here is the magic, adding 1 day every second
            let newDate = new Date(props.selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            props.setSelectedDate(newDate);

            //Here is the reset if the date goes at the end
            const cutoffDate = new Date("2023-01-01")
            if(newDate > cutoffDate){
                handleReset();
            }
            return () => clearInterval(timer)
        }
    }, [isPlaying,count])

    const handlePlay = () => {
        setPlaying(true);
    }

    const handlePause = () => {
        setPlaying(false);
    }

    const handleReset = () =>{
        const resetDate = new Date("2018-01-01")
        props.setSelectedDate(resetDate)
    }
    return (
        <div className="DateControls">
            <div className="buttons">
                <button onClick={() => handlePlay()}>Play</button>
                <button  onClick={() => handlePause()}>Pause</button>
                <button  onClick={() => handleReset()}>Reset</button>
            </div>

                <p>{props.selectedDate.toLocaleString("de-DE", {
                day: "numeric",
                month: "short",
                year: "numeric",
                })}</p>

        </div>
    )
}

export default DateControls
