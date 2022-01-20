import React, { useState, useCallback, useEffect } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "~/components/Button";
import ButtonBack from "~/components/ButtonBack";
import Input from "~/components/Input";
import InputPrice from "~/components/InputPrice";
import Photo from "~/components/Photo";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import {
    Container,
    Header,
    Title,
    DeleteLabel,
    Upload,
    PickImageButton,
    Form,
    InputGroup,
    InputGroupHeader,
    Label,
    MaxCharacters,
} from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProductNavigationProps } from "~/@types/navigation";
import { ProductProps } from "~/components/ProductCard";

interface PizzaResponse extends ProductProps {
    photo_path: string;
    prices_sizes: {
        p: string;
        m: string;
        g: string;
    };
}

const Product: React.FC = () => {
    const [image, setImage] = useState("");
    const [photoPath, setPhotoPath] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priceSizeP, setPriceSizeP] = useState("");
    const [priceSizeM, setPriceSizeM] = useState("");
    const [priceSizeG, setPriceSizeG] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as ProductNavigationProps;

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleImagePicker = useCallback(async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status === "granted") {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4],
            });

            if (!result.cancelled) {
                setImage(result.uri);
            }
        }
    }, [setImage]);

    const handleAdd = useCallback(async () => {
        if (!name.trim()) {
            return Alert.alert("Cadastro", "Informe o nome da pizza");
        }

        if (!description.trim()) {
            return Alert.alert("Cadastro", "Informe a descrição da pizza");
        }

        if (!image) {
            return Alert.alert("Cadastro", "Selecione a imagem da pizza");
        }

        if (!priceSizeP || !priceSizeM || !priceSizeG) {
            return Alert.alert(
                "Cadastro",
                "Informe o preço de todos os tamanhos da pizza."
            );
        }

        setIsLoading(true);

        const fileName = new Date().getTime();
        const reference = storage().ref(`/pizzas/${fileName}.png`);

        await reference.putFile(image);
        const photo_url = await reference.getDownloadURL();

        firestore()
            .collection("pizzas")
            .add({
                name,
                name_insensitive: name.toLowerCase().trim(),
                description,
                prices_sizes: {
                    p: priceSizeP,
                    m: priceSizeM,
                    g: priceSizeG,
                },
                photo_url,
                photo_path: reference.fullPath,
            })
            .then(() => {
                navigation.navigate("home");
                Alert.alert("Cadastro", "Pizza cadastrada com sucesso.");
            })
            .catch(() => {
                setIsLoading(false);
                Alert.alert("Cadastro", "Não foi possível cadastrar a pizza.");
            });
    }, [name, description, image, priceSizeP, priceSizeM, priceSizeG]);

    const handleDelete = () => {
        firestore()
            .collection("pizzas")
            .doc(id)
            .delete()
            .then(() => {
                storage()
                    .ref(photoPath)
                    .delete()
                    .then(() => {
                        Alert.alert("Pizza deletada com sucesso");
                        navigation.navigate("home");
                    });
            });
    };

    useEffect(() => {
        if (id) {
            firestore()
                .collection("pizzas")
                .doc(id)
                .get()
                .then((response) => {
                    const product = response.data() as PizzaResponse;

                    setName(product.name);
                    setImage(product.photo_url);
                    setPhotoPath(product.photo_path);
                    setDescription(product.description);
                    setPriceSizeP(product.prices_sizes.p);
                    setPriceSizeM(product.prices_sizes.m);
                    setPriceSizeG(product.prices_sizes.g);
                });
        }
    }, [id]);

    return (
        <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Header>
                <ButtonBack onPress={handleGoBack} />

                <Title>Cadastrar</Title>

                {id ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <DeleteLabel>Deletar</DeleteLabel>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 20 }} />
                )}
            </Header>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Upload>
                    <Photo uri={image} />

                    {!id && (
                        <PickImageButton
                            title="Carregar"
                            type="secondary"
                            onPress={handleImagePicker}
                        />
                    )}
                </Upload>

                <Form>
                    <InputGroup>
                        <Label>Nome</Label>
                        <Input value={name} onChangeText={setName} />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupHeader>
                            <Label>Descrição</Label>
                            <MaxCharacters>0 de 60 caracteres</MaxCharacters>
                        </InputGroupHeader>

                        <Input
                            multiline
                            maxLength={60}
                            style={{ height: 80 }}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Tamanhos e preços</Label>

                        <InputPrice
                            size="P"
                            value={priceSizeP}
                            onChangeText={setPriceSizeP}
                        />
                        <InputPrice
                            size="M"
                            value={priceSizeM}
                            onChangeText={setPriceSizeM}
                        />
                        <InputPrice
                            size="G"
                            value={priceSizeG}
                            onChangeText={setPriceSizeG}
                        />
                    </InputGroup>

                    {!id && (
                        <Button
                            title="Cadastrar Pizza"
                            isLoading={isLoading}
                            onPress={handleAdd}
                        />
                    )}
                </Form>
            </ScrollView>
        </Container>
    );
};

export default Product;
