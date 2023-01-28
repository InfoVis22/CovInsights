import { createContext, ReactNode, useContext, useState } from "react";
import { IEmploymentData } from "../index";

//define interface for AppContext
interface IAppContext {
    employmentData: IEmploymentData;
    setEmploymentData: React.Dispatch<React.SetStateAction<IEmploymentData>>;
    coronaData: null;
    setCoronaData: React.Dispatch<React.SetStateAction<null>>;
    hoveredTime: Date;
    setHoveredTime: React.Dispatch<React.SetStateAction<Date>>;
    timeFrame: { min: Date; max: Date; };
    setTimeFrame: React.Dispatch<React.SetStateAction<{ min: Date; max: Date; }>>;
    showTooltipsTime: boolean;
    setShowTooltipsTime: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
    umsatzData: null;
    setUmsatzData: React.Dispatch<React.SetStateAction<null>>;
    InsolvencyBarData: null;
    setInsolvencyBarData: React.Dispatch<React.SetStateAction<null>>;
}

//create Context
const Context = createContext<IAppContext>({} as IAppContext);

//hook that makes Context usable from everywhere in the app
export const useAppContext = () => useContext(Context);

export const AppContext = ({ children }: { children: ReactNode }) => {

    const [employmentData, setEmploymentData] = useState(null as IEmploymentData);
    const [umsatzData, setUmsatzData] = useState(null);
    const [insolvenzenData, setInsolvenzenData] = useState(null);
    const [coronaData, setCoronaData] = useState(null);
    const [kurzarbeitData, setKurzarbeitData] = useState(null)

    const [showTooltipsTime, setShowTooltipsTime] = useState(false);
    const [verticalLayout, setVerticalLayout] = useState(false)

    const [timeFrame, setTimeFrame] = useState({ min: new Date(2018, 0), max: new Date(2023, 0) });
    const [selectedDate, setSelectedDate] = useState(timeFrame.min)
    const [hoveredTime, setHoveredTime] = useState(timeFrame.min);


    //custom functions to ensure that all data is in the timeFrame range
    const setInsolvenzData = (data: []) => {
        const filtered = data.filter(d => d.Date >= timeFrame.min && d.Date <= timeFrame.max)
        setInsolvenzDataFiltered(filtered)
    }



    const AppValues = {
        umsatzData, setUmsatzData,
        employmentData, setEmploymentData,
        insolvenzenData, setInsolvenzenData,
        coronaData, setCoronaData,
        kurzarbeitData, setKurzarbeitData,
        timeFrame, setTimeFrame,
        hoveredTime, setHoveredTime,
        selectedDate, setSelectedDate,
        showTooltipsTime, setShowTooltipsTime,
        verticalLayout, setVerticalLayout
    }

    return (
        <Context.Provider value={AppValues}>
            {children}
        </Context.Provider>
    );
};


export default AppContext