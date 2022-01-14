import React from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import brandImg from "~/assets/brand.png";
import {
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";

import {
    Container,
    Content,
    Title,
    Brand,
    ForgotPasswordButton,
    ForgotPasswordLabel,
} from "./styles";

const SignIn = () => {
    return (
        <Container>
            <KeyboardAvoidingView behavior="position">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Content>
                        <Brand source={brandImg} />

                        <Title>Login</Title>

                        <Input
                            placeholder="E-mail"
                            type="secondary"
                            autoCorrect={false}
                            autoCapitalize="none"
                        />

                        <Input
                            placeholder="Login"
                            type="secondary"
                            secureTextEntry
                        />

                        <ForgotPasswordButton>
                            <ForgotPasswordLabel>
                                Esqueci minha senha
                            </ForgotPasswordLabel>
                        </ForgotPasswordButton>

                        <Button
                            title="Entrar"
                            type="secondary"
                            isLoading={false}
                        />
                    </Content>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default SignIn;
