import React from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import {
    Container,
    Input,
    Button,
    InputArea,
    ButtonClear
} from './styles';

interface Props  extends TextInputProps {
    onSearch: () => void;
    onClear: () => void;
}

const Search: React.FC<Props> = ({ onSearch, onClear, ...rest}) => {
    const { COLORS } = useTheme();

    return (
        <Container>
            <InputArea>
                <Input placeholder="pesquisar..." {...rest} />

                <ButtonClear onPress={onClear}>
                    <Feather  name="x" size={16} colors={COLORS.TITLE} />
                </ButtonClear>
            </InputArea>


            <Button  onPress={onSearch}>
                <Feather  name="search" size={16} colors={COLORS.TITLE} />
            </Button>
        </Container>
    );
}

export default Search;