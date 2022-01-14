import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import theme from "~/theme";

import { Container, Title, Load, TypeProps } from "./styles";

interface Props extends RectButtonProps {
    title: string;
    type?: TypeProps;
    isLoading?: boolean;
}

const Button: React.FC<Props> = ({
    title,
    type = "primary",
    isLoading = false,
    ...rest
}) => {
    return (
        <Container type={type} enabled={!isLoading} {...rest}>
            {isLoading ? (
                <Load color={theme.COLORS.TITLE} animating={true} />
            ) : (
                <Title>{title}</Title>
            )}
        </Container>
    );
};

export default Button;
