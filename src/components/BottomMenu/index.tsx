import React, { useMemo } from "react";

import { Container, Notification, Quantity, Title } from "./styles";

type Props = {
    title: string;
    color: string;
    notifications?: string | undefined;
};

const BottomMenu: React.FC<Props> = ({ title, color, notifications }) => {
    const noNotification = useMemo(() => {
        return notifications === "0";
    }, [notifications]);

    return (
        <Container>
            <Title color={color}>{title}</Title>

            {notifications && (
                <Notification noNotifications={noNotification}>
                    <Quantity noNotifications={noNotification}>
                        {notifications}
                    </Quantity>
                </Notification>
            )}
        </Container>
    );
};

export default BottomMenu;
