const Line = ({ data, lineGenerator }) => {

    return (
        <path
            stroke="darkblue"
            strokeWidth="1.5"
            fill="none"
            d={lineGenerator(data)}
            style={{ transition: "all 0.5s ease-in-out" }}
        />
    )
}

export default Line