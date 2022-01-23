import React, { useEffect, useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";
import ItemSeparator from "~/components/ItemSeparator";
import OrderCard, { OrderProps } from "~/components/OrderCard";
import firestore from "@react-native-firebase/firestore";

import { Container, Header, Title } from "./styles";
import { useAuth } from "~/hooks/auth";

const Orders = () => {
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const { user } = useAuth();

    const handlePizzaDelivered = useCallback((id: string) => {
        Alert.alert("Pedido", "Confirmar que a pizza foi entregue?", [
            {
                text: "Não",
                style: "cancel",
            },
            {
                text: "Sim",
                onPress: () => {
                    firestore().collection("orders").doc(id).update({
                        status: "Entregue",
                    });
                },
            },
        ]);
    }, []);

    const renderItem = useCallback(({ item, index }) => {
        return (
            <OrderCard
                index={index}
                data={item}
                disabled={item.status === "Entregue"}
                onPress={() => handlePizzaDelivered(item.id)}
            />
        );
    }, []);

    useEffect(() => {
        const subscribe = firestore()
            .collection("orders")
            .where("waiter_id", "==", user?.id)
            .onSnapshot((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                }) as OrderProps[];
                setOrders(data);
            });

        return () => subscribe();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Pedidos</Title>
            </Header>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: 125,
                }}
                ItemSeparatorComponent={() => <ItemSeparator />}
            />
        </Container>
    );
};

export default Orders;
