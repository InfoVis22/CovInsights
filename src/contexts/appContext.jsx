import { createContext, useContext, useState } from "react";

//create empty context
const Context = createContext({});

//hook that makes Context usable from everywhere in the app
export const useAppContext = () => useContext(Context);

export const AppContext = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    
    const [employmentData, setEmploymentData] = useState(null);
    const [umsatzData, setUmsatzData] = useState(null);
    const [InsolvencyBarData, setInsolvencyBarData] = useState(null);

    const [insolvenzData, setInsolvenzDataFiltered] = useState(null);
    const [coronaData, setCoronaData] = useState(null);
    const [hoveredTime, setHoveredTime] = useState(new Date(2020, 5));
    const [timeFrame, setTimeFrame] = useState({ min: new Date(2018, 0), max: new Date() });
    const [showTooltipsTime, setShowTooltipsTime] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date("2018-01-01"))


    //custom functions to ensure that all data is in the timeFrame range
    const setInsolvenzData = (data) => {
        const filtered = data.filter(d => d.Date >= timeFrame.min && d.Date <= timeFrame.max)
        setInsolvenzDataFiltered(filtered)
    }

    const AppValues = {
        currentUser, setCurrentUser,
        employmentData, setEmploymentData,
        coronaData, setCoronaData,
        insolvenzData, setInsolvenzData,
        umsatzData, setUmsatzData,
        hoveredTime, setHoveredTime,
        timeFrame, setTimeFrame,
        showTooltipsTime, setShowTooltipsTime,
        selectedDate, setSelectedDate,
        InsolvencyBarData, setInsolvencyBarData
    }

    return (
        <Context.Provider value={AppValues}>
            {children}
        </Context.Provider>
    );
};


export default AppContext