import './Legend.scss'
import variables from '../../Variables.scss'

const DashboardTopic = {
    SalesVolume : 0,
    Employment : 1,
    Insolvencies : 2,
}

/*
function DashboardTopicToColor(dashboardTopic){
    switch(dashboardTopic)
    {
        case DashboardTopic.SalesVolume:
            return variables.;
        case DashboardTopic.Employment:
            return blue;
        case DashboardTopic.Insolvencies:
            return black;
    }

    return rgb(0,0,0);
}
*/

function DashboardTopicToString(dashboardTopic){
    switch(dashboardTopic)
    {
        case DashboardTopic.SalesVolume:
            return 'Umsatz';
        case DashboardTopic.Employment:
            return 'Beschäftigung';
        case DashboardTopic.Insolvencies:
            return 'Insolvenzen';
    }

    return '';
}

const Legend = () => {

    return (
        <div className="Legend">
            <h1>Legend</h1>
            <LegendItem dashboardTopic={DashboardTopic.SalesVolume} />
            <LegendItem dashboardTopic={DashboardTopic.Employment} />
            <LegendItem dashboardTopic={DashboardTopic.Insolvencies} />
        </div>
    )
}

const LegendItem = ({dashboardTopic}) => {
    // var itemColor = DashboardTopicToColor(dashboardTopic);
    var itemText = DashboardTopicToString(dashboardTopic);

    return (
        <tr>
            <th>
                <div className='LegendColorCircle'>testii</div>
            </th>
            <th>
                <p>{itemText}</p>
            </th>
        </tr>
    )
}

export default Legend
