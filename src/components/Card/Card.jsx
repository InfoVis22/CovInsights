// IMPORTS
import './Card.scss'
import { AiOutlineInfoCircle } from 'react-icons/ai';
import {Button, Popover, Text} from "@nextui-org/react";

const Card = ({ title, subtitle,description, children }) => {

    return (
        <div className="Card">
            <div className="Heading">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            <div className="Info">

                <Popover isBordered disableShadow>
                    <Popover.Trigger>
                        <Button auto flat color="white"  size = "xs"><AiOutlineInfoCircle /></Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$8" }}>{description}</Text>
                    </Popover.Content>
                </Popover>
            </div>
            {children}
        </div>
    )
}

export default Card
