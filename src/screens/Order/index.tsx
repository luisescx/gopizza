import React, { useCallback, useEffect, useMemo, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Alert, Platform } from "react-native";
import { useTheme } from "styled-components/native";
import { ProductNavigationProps } from "~/@types/navigation";
import Button from "~/components/Button";
import ButtonBack from "~/components/ButtonBack";
import Input from "~/components/Input";
import { ProductProps } from "~/components/ProductCard";
import RadioButton from "~/components/RadioButton";
import { useAuth } from "~/hooks/auth";
import { PIZZA_TYPES } from "~/util/pizzaTypes";

import {
    Container,
    ContentScroll,
    Header,
    Photo,
    Sizes,
    Form,
    FormRow,
    InputGroup,
    Label,
    Price,
    Title,
} from "./styles";

type PizzaResponse = ProductProps & {
    prices_sizes: {
        [key: string]: number;
    };
};

const Order: React.FC = () => {
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [tableNumber, setTableNumber] = useState("");
    const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
    const [sendingOrder, setSendingOrder] = useState(false);

    const { user } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as ProductNavigationProps;
    const { COLORS } = useTheme();

    const amount = useMemo(() => {
        return size ? (pizza.prices_sizes[size] * quantity).toFixed(2) : "0.00";
    }, [size, pizza.prices_sizes, quantity]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const validateOrder = useCallback(() => {
        if (!size) {
            Alert.alert("Pedido", "Selecione o tamanho da pizza.");
            return false;
        }

        if (!tableNumber) {
            Alert.alert("Pedido", "Informe o número da mesa.");
            return false;
        }

        if (!quantity) {
            Alert.alert("Pedido", "Informe a quantidade.");
            return false;
        }

        return true;
    }, [size, tableNumber, quantity]);

    const handleOrder = useCallback(() => {
        if (validateOrder()) {
            setSendingOrder(true);

            firestore()
                .collection("orders")
                .add({
                    quantity,
                    amount,
                    pizza: pizza.name,
                    size,
                    table_number: tableNumber,
                    status: "Preparando",
                    waiter_id: user?.id,
                    image: pizza.photo_url,
                })
                .then(() => {
                    Alert.alert("Pedido", "Pedido feito com sucesso");
                    navigation.navigate("home");
                })
                .catch(() => {
                    Alert.alert("Pedido", "Pedido feito com sucesso");
                    setSendingOrder(false);
                });
        }
    }, [validateOrder, navigation, setSendingOrder, pizza, user]);

    useEffect(() => {
        if (id) {
            firestore()
                .collection("pizzas")
                .doc(id)
                .get()
                .then((response: any) =>
                    setPizza(response.data() as PizzaResponse)
                )
                .catch(() =>
                    Alert.alert("Pedido", "Não foi possível carregar o produto")
                );
        }
    }, [id]);

    return (
        <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <StatusBar
                style="light"
                translucent
                backgroundColor={COLORS.PRIMARY_900}
            />
            <ContentScroll>
                <Header>
                    <ButtonBack
                        onPress={handleGoBack}
                        style={{ marginBottom: 108 }}
                    />
                </Header>

                <Photo source={{ uri: pizza.photo_url }} />

                <Form>
                    <Title>{pizza.name}</Title>
                    <Label>Selecione um Tamnaho</Label>

                    <Sizes>
                        {PIZZA_TYPES.map((item) => (
                            <RadioButton
                                key={item.id}
                                title={item.name}
                                onPress={() => setSize(item.id)}
                                selected={size === item.id}
                            />
                        ))}
                    </Sizes>

                    <FormRow>
                        <InputGroup>
                            <Label>Número da Mesa</Label>
                            <Input
                                keyboardType="numeric"
                                onChangeText={setTableNumber}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Quantidade</Label>
                            <Input
                                keyboardType="numeric"
                                onChangeText={(value) =>
                                    setQuantity(Number(value))
                                }
                            />
                        </InputGroup>
                    </FormRow>

                    <Price>Valor de R$ {amount}</Price>

                    <Button
                        title="Confirmar Pedido"
                        onPress={handleOrder}
                        isLoading={sendingOrder}
                    />
                </Form>
            </ContentScroll>
        </Container>
    );
};

export default Order;
