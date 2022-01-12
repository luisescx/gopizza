import React from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";

import { Container } from "./styles";

const SignIn = () => {
    return (
        <Container>
            <Input
                placeholder="E-mail"
                type="secondary"
                autoCorrect={false}
                autoCapitalize="none"
            />

            <Input placeholder="Login" type="secondary" secureTextEntry />

            <Button title="Entrar" type="secondary" isLoading={true} />
        </Container>
    );
};

export default SignIn;
