const Line = ({ data, lineGenerator, color = 'black', strokeWidth = 1.5 }) => {

    return (
        <path
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            d={lineGenerator(data)}
            style={{ transition: "all 0.5s ease-in-out" }}
        />
    )
}

export default Line