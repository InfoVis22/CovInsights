const Line = ({ data, lineGenerator, color = 'black' }) => {

    return (
        <path
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            d={lineGenerator(data)}
            style={{ transition: "all 0.5s ease-in-out" }}
        />
    )
}

export default Line