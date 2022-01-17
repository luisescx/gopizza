import React, { useState } from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import Button from "~/components/Button";
import ButtonBack from "~/components/ButtonBack";
import Input from "~/components/Input";
import InputPrice from "~/components/InputPrice";
import Photo from "~/components/Photo";

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

interface ProductDTO {
    image: string;
    name: string;
    description: string;
    priceSizeP: string;
    priceSizeM: string;
    priceSizeG: string;
}

interface ProductChangeProps {
    value: string;
    keyName: string;
}

const Product: React.FC = () => {
    // const [image, setImage] = useState("");
    // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");
    // const [priceSizeP, setPriceSizeP] = useState("");
    // const [priceSizeM, setPriceSizeM] = useState("");
    // const [priceSizeG, setPriceSizeG] = useState("");

    const [pizzaProduct, setPizzaProduct] = useState({} as ProductDTO);
    const [isLoading, setIsLoading] = useState(false);

    function handleProductChange({ value, keyName }: ProductChangeProps) {
        setPizzaProduct((prevState) => {
            return { ...prevState, [keyName]: value };
        });
    }

    function handleSubmitProduct() {
        setPizzaProduct({} as ProductDTO);
    }

    return (
        <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Header>
                <ButtonBack />

                <Title>Cadastrar</Title>

                <TouchableOpacity>
                    <DeleteLabel>Deletar</DeleteLabel>
                </TouchableOpacity>
            </Header>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Upload>
                    <Photo uri={""} />

                    <PickImageButton title="Carregar" type="secondary" />
                </Upload>

                <Form>
                    <InputGroup>
                        <Label>Nome</Label>
                        <Input
                            value={pizzaProduct.name}
                            onChangeText={(value) =>
                                handleProductChange({ value, keyName: "name" })
                            }
                        />
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
                            value={pizzaProduct.description}
                            onChangeText={(value) =>
                                handleProductChange({
                                    value,
                                    keyName: "description",
                                })
                            }
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Tamanhos e preços</Label>

                        <InputPrice
                            size="P"
                            value={pizzaProduct.priceSizeP}
                            onChangeText={(value) =>
                                handleProductChange({
                                    value,
                                    keyName: "priceSizeP",
                                })
                            }
                        />
                        <InputPrice
                            size="M"
                            value={pizzaProduct.priceSizeM}
                            onChangeText={(value) =>
                                handleProductChange({
                                    value,
                                    keyName: "priceSizeM",
                                })
                            }
                        />
                        <InputPrice
                            size="G"
                            value={pizzaProduct.priceSizeG}
                            onChangeText={(value) =>
                                handleProductChange({
                                    value,
                                    keyName: "priceSizeG",
                                })
                            }
                        />
                    </InputGroup>

                    <Button
                        title="Cadastrar Pizza"
                        isLoading={isLoading}
                        onPress={handleSubmitProduct}
                    />
                </Form>
            </ScrollView>
        </Container>
    );
};

export default Product;
