import { useRouteError } from "react-router-dom";
import TopBar from "../components/TopBar/TopBar";


const errorStyle = {
    display: 'flex',
    minWidth: '100vw',
    flexDirection: 'column',
    alignItems: 'center'
}


const ErrorPage = () => {
    const error = useRouteError();

    return (
        <>
            <TopBar />
            <div id="error-page" style={errorStyle}>
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>{error.status + ' - ' + error.statusText || error.message}</p>
            </div>
        </>
    );
}

export default ErrorPage