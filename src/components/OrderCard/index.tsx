import React from "react";
import { TouchableOpacityProps } from "react-native";

import {
    Container,
    Description,
    Image,
    Name,
    StatusContainer,
    StatusLabel,
    StatusTypesProps,
} from "./styles";

type Props = TouchableOpacityProps & {
    index: number;
    data: OrderProps;
};

export interface OrderProps {
    id: string;
    amount: string;
    image: string;
    pizza: string;
    quantity: number;
    size: string;
    status: StatusTypesProps;
    table_number: string;
    waiter_id: string;
}

const OrderCard: React.FC<Props> = ({ index, data, ...rest }) => {
    return (
        <Container index={index} {...rest}>
            <Image source={{ uri: data.image }} />

            <Name>{data.pizza}</Name>

            <Description>
                Mesa {data.table_number} - Qtd: {data.quantity}
            </Description>

            <StatusContainer status={data.status}>
                <StatusLabel status={data.status}>{data.status}</StatusLabel>
            </StatusContainer>
        </Container>
    );
};

export default OrderCard;
