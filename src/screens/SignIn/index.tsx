import React, { useState, useRef } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import brandImg from "~/assets/brand.png";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
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

    const passwordRef = useRef<TextInput>(null);

    const { signIn, isLogging, forgotPassword } = useAuth();

    function handleSignIn() {
        signIn(email, password);
    }

    function handleForgotPassword() {
        forgotPassword(email);
    }

    function handleFocus() {
        passwordRef.current?.focus();
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
                            keyboardType="email-address"
                            onSubmitEditing={handleFocus}
                        />

                        <Input
                            ref={passwordRef}
                            placeholder="Senha"
                            type="secondary"
                            secureTextEntry
                            onChangeText={setPassword}
                            onSubmitEditing={handleSignIn}
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
