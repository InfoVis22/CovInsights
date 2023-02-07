import './DateControls.scss'
import { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../contexts/appContext'
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import { GrPowerReset } from 'react-icons/gr'

const DateControls = () => {

    let timer
    const [count, setCount] = useState(0)
    const [isPlaying, setPlaying] = useState(false)
    const { selectedDate, setSelectedDate, timeFrame } = useAppContext();

    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setCount(prevCount => prevCount + 1)
        }, 100)

        //Limit of five years in days
        //if (count === 1835) clearInterval(timer)
    }

    const handleKeyPress = (e) => {
        //CTRL + spacebar 
        if (e.ctrlKey && e.keyCode === 32) {
            setPlaying(old => !old)
        }
        //CTRL + R
        else if (e.ctrlKey && e.keyCode === 82) {
            handleReset();
        }
    }

    useEffect(() => {
        if (isPlaying) {
            updateCount()

            //Here is the magic, adding 2 day every second
            let newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 2);
            setSelectedDate(newDate);

            //Here is the reset if the date goes at the end
            const cutoffDate = new Date("2023-01-01")
            if (newDate > cutoffDate) {
                handleReset();
            }

            return () => {
                clearInterval(timer)
            }
        }
    }, [isPlaying, count])

    useEffect(() => {
        //add eventListener to all keypress events
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [])

    useEffect(() => {
        handleReset();
    }, [timeFrame])

    const handleReset = () => {
        setSelectedDate(timeFrame.min)
        setPlaying(false)
    }

    return (
        <div className="DateControls">
            <div className="buttons">
                {!isPlaying ?
                    (<button onClick={() => setPlaying(true)} title="CTRL + SPACE"><IoPlayOutline /> Play</button>) :
                    (<button onClick={() => setPlaying(false)} title="CTRL + SPACE"><IoPauseOutline /> Pause</button>)}

                <button onClick={() => handleReset()} title="CTRL + R"><GrPowerReset />Reset</button>
            </div>

            <p>{selectedDate?.toLocaleString("de-DE", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })}</p>

        </div>
    )
}

export default DateControls
