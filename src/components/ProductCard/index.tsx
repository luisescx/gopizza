import React from 'react';
import {  RectButtonProps } from 'react-native-gesture-handler';
import {
    Container,
    Content,
    Details,
    Image,
    Line,
    Identification,
    Name,
    Description
} from './styles';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

export interface ProductProps {
    id: string;
    photo_url: string;
    name: string;
    description: string;
}

export interface Props extends RectButtonProps {
    data: ProductProps;
}

const ProductCard: React.FC<Props> = ({ data }) => {
    const { COLORS } = useTheme();

    return (
        <Container>
                <Content>
                    <Image source={{ uri: data.photo_url}} />

                    <Details>
                        <Identification>
                            <Name>{data.name}</Name>
                            <Feather name="chevron-right" size={18} color={COLORS.SHAPE} />
                        </Identification>

                        <Description>{data.description}</Description>
                    </Details>
                </Content>

                <Line />
        </Container>
    );
}

export default ProductCard;