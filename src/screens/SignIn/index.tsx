import React, { useState } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import brandImg from "~/assets/brand.png";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
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
import { useAuth } from "~/hooks/auth";

const SignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signIn, isLogging, forgotPassword } = useAuth();

    function handleSignIn() {
        console.log("handleSignIn");
        signIn(email, password);
    }

    function handleForgotPassword() {
        forgotPassword(email);
    }

    return (
        <Container>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Content>
                        <Brand source={brandImg} />

                        <Title>Login</Title>

                        <Input
                            placeholder="E-mail"
                            type="secondary"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />

                        <Input
                            placeholder="Login"
                            type="secondary"
                            secureTextEntry
                            onChangeText={setPassword}
                        />

                        <ForgotPasswordButton onPress={handleForgotPassword}>
                            <ForgotPasswordLabel>
                                Esqueci minha senha
                            </ForgotPasswordLabel>
                        </ForgotPasswordButton>

                        <Button
                            title="Entrar"
                            type="secondary"
                            isLoading={isLogging}
                            onPress={handleSignIn}
                        />
                    </Content>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default SignIn;
