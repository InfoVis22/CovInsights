import { createContext, useContext, useState } from "react";

//create empty context
const Context = createContext({});

//hook that makes Context usable from everywhere in the app
export const useAppContext = () => useContext(Context);

export const AppContext = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [hoveredTime, setHoveredTime] = useState(null);
    const [gastgewerbeData, setGastgewerbeData] = useState(null);
    const [coronaData, setCoronaData] = useState(null);
    const [insolvenzData, setInsolvenzDataFiltered] = useState(null);
    const [timeFrame, setTimeFrame] = useState({ min: new Date(2018, 0), max: new Date() });
    const [showTooltipsTime, setShowTooltipsTime] = useState(false);


    //custom functions to ensure that all data is in the timeFrame range
    const setInsolvenzData = (data) => {
        const filtered = data.filter(d => d.Date >= timeFrame.min && d.Date <= timeFrame.max)
        setInsolvenzDataFiltered(filtered)
    }

    const AppValues = {
        currentUser, setCurrentUser,
        hoveredTime, setHoveredTime,
        gastgewerbeData, setGastgewerbeData,
        coronaData, setCoronaData,
        insolvenzData, setInsolvenzData,
        timeFrame, setTimeFrame,
        showTooltipsTime, setShowTooltipsTime,
    }

    return (
        <Context.Provider value={AppValues}>
            {children}
        </Context.Provider>
    );
};


export default AppContext