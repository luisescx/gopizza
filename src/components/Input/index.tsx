import React, { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

import { Container, TypeProps } from "./styles";

interface Props extends TextInputProps {
    type?: TypeProps;
    ref?: React.Ref<TextInput> | undefined;
}

const Input: React.FC<Props> = forwardRef(
    ({ type = "primary", ...rest }, ref) => {
        return <Container ref={ref} type={type} {...rest} />;
    }
);

export default Input;
