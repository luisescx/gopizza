import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import happyEmoji from '~assets/happy.png';

import { Container, Header,
    Greeting,
    GreetingEmoji,
    GreetingText,
    MenuHeader,
    Title,
    MenuItemsNumber
} from "./styles";

import { useTheme } from "styled-components/native";
import Search from "~/components/Search";
import ProductCard from "~/components/ProductCard";

const Home = () => {
    const { COLORS } = useTheme()

    return <Container>
        <Header>
            <Greeting>
                <GreetingEmoji source={happyEmoji} />
                <GreetingText>Olá, Admin</GreetingText>
            </Greeting>

            <TouchableOpacity>
                <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
            </TouchableOpacity>
        </Header>

        <Search onClear={() => {}} onSearch={() => {}}/>

        <MenuHeader>
            <Title>Cardápio</Title>
            <MenuItemsNumber>10 pizzas</MenuItemsNumber>
        </MenuHeader>

        <ProductCard  data={{ id: "1", name: "Pizza", description: "Pizza Teste", photo_url: "https://github.com/luisescx.png"}} />
    </Container>;
};

export default Home;
