import React, { useEffect, useState, useCallback } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import happyEmoji from "~assets/happy.png";

import {
    Container,
    Header,
    Greeting,
    GreetingEmoji,
    GreetingText,
    MenuHeader,
    Title,
    MenuItemsNumber,
    NewProductButton,
} from "./styles";

import { useTheme } from "styled-components/native";
import Search from "~/components/Search";
import ProductCard, { ProductProps } from "~/components/ProductCard";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "~/hooks/auth";

const Home = () => {
    const [pizzas, setPizzas] = useState<ProductProps[]>([]);
    const [search, setSearch] = useState("");
    const navigation = useNavigation();
    const { COLORS } = useTheme();
    const { user, signOut } = useAuth();

    const fetchPizzas = useCallback((value: string) => {
        const formattedValue = value.toLocaleLowerCase().trim();

        firestore()
            .collection("pizzas")
            .orderBy("name_insensitive")
            .startAt(formattedValue)
            .endAt(`${formattedValue}\uf8ff`)
            .get()
            .then((response) => {
                const data = response.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                }) as ProductProps[];

                setPizzas(data);
            })
            .catch(() =>
                Alert.alert("Consulta", "Não foi possível fazer a consulta")
            );
    }, []);

    const handleSearch = useCallback(() => {
        fetchPizzas(search);
    }, [fetchPizzas]);

    const handleClearSearch = useCallback(() => {
        setSearch("");
        fetchPizzas("");
    }, [setSearch, fetchPizzas]);

    const handleOpen = useCallback(
        (id: string) => {
            const route = user?.isAdmin ? "product" : "order";
            navigation.navigate(route, { id });
        },
        [navigation]
    );

    const handleAdd = useCallback(() => {
        navigation.navigate("product", {});
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            fetchPizzas("");
        }, [])
    );

    return (
        <Container>
            <Header>
                <Greeting>
                    <GreetingEmoji source={happyEmoji} />
                    <GreetingText>Olá, Admin</GreetingText>
                </Greeting>

                <TouchableOpacity onPress={signOut}>
                    <MaterialIcons
                        name="logout"
                        color={COLORS.TITLE}
                        size={24}
                    />
                </TouchableOpacity>
            </Header>

            <Search
                value={search}
                onChangeText={setSearch}
                onClear={handleClearSearch}
                onSearch={handleSearch}
            />

            <MenuHeader>
                <Title>Cardápio</Title>
                <MenuItemsNumber>{pizzas.length}</MenuItemsNumber>
            </MenuHeader>

            <FlatList
                data={pizzas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ProductCard
                        data={item}
                        onPress={() => handleOpen(item.id)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 125,
                    marginHorizontal: 24,
                }}
            />

            {!!user?.isAdmin && (
                <NewProductButton
                    title="Cadastrar Pizza"
                    type="secondary"
                    onPress={handleAdd}
                />
            )}
        </Container>
    );
};

export default Home;
