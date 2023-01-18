import './SourceSpec.scss'

const SourceSpec = ({ sourceDescription, sourceLink, lastTimeVisited }) => {
    return (
        <tr className="SourceSpec">
            <th><li></li></th>
            <th>{sourceDescription}</th>
            <th>
                <a href={sourceLink}>{sourceLink}</a>
            </th>
            <th>{lastTimeVisited}</th>
        </tr>
    )
}

export default SourceSpec
