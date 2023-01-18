import './SourceSpec.scss'

const SourceSpec = ({ sourceDescription, sourceLink, lastTimeVisited }) => {
    return (
        <tr className="SourceSpec">
            <th>
                <li></li>
            </th>
            <th>
                <p>{lastTimeVisited}</p>
            </th>
            <th>
                <p>{sourceDescription}</p>
                <a href={sourceLink}>{sourceLink}</a>
            </th>
        </tr>
    )
}

export default SourceSpec
