import { createContext, useContext, useState } from "react";

//create empty context
const Context = createContext({});

//hook that makes Context usable from everywhere in the app
export const useAppContext = () => useContext(Context);

export const AppContext = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [time, setTime] = useState(null);
    const [gastgewerbeData, setGastgewerbeData] = useState(null);

    const AppValues = { currentUser, setCurrentUser, time, setTime, gastgewerbeData, setGastgewerbeData }

    return (
        <Context.Provider value={AppValues}>
            {children}
        </Context.Provider>
    );
};


export default AppContext