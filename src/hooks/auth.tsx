import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextData {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    user: User | null;
    isLogging: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    isAdmin: boolean;
}

const USER_COLLECTION = "@gopizza:users";

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [isLogging, setIsLogging] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    async function signIn(email: string, password: string) {
        if (!email || !password) {
            return Alert.alert("Login", "Informe o e-mail e a senha");
        }

        setIsLogging(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .then((account) => {
                firestore()
                    .collection("users")
                    .doc(account.user.uid)
                    .get()
                    .then(async (profile) => {
                        const { name, isAdmin } = profile.data() as User;

                        if (profile.exists) {
                            const userData = {
                                id: account.user.uid,
                                name,
                                isAdmin,
                            };

                            await AsyncStorage.setItem(
                                USER_COLLECTION,
                                JSON.stringify(userData)
                            );
                            setUser(userData);
                        }
                    })
                    .catch(() =>
                        Alert.alert(
                            "Login",
                            "N??o foi poss??vel buscar os dados do usu??rio."
                        )
                    );
            })
            .catch((error) => {
                const { code } = error;

                if (
                    code === "auth/user-not-found" ||
                    code === "auth/wrong-password"
                ) {
                    return Alert.alert("Login", "E-mail e/ou senha inv??lida.");
                }

                return Alert.alert("Login", "N??o foi poss??vel fazer o login.");
            })
            .finally(() => setIsLogging(false));
    }

    async function loadUserStorageData() {
        setIsLogging(true);

        const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

        if (storedUser) {
            const userData = JSON.parse(storedUser) as User;
            setUser(userData);
        }

        setIsLogging(false);
    }

    async function signOut() {
        await auth().signOut();
        await AsyncStorage.removeItem(USER_COLLECTION);
        setUser(null);
    }

    async function forgotPassword(email: string) {
        if (!email) {
            return Alert.alert("Redefinir Senha", "Informe o e-mail.");
        }

        auth()
            .sendPasswordResetEmail(email)
            .then(() =>
                Alert.alert(
                    "Redefinir Senha",
                    "Enviamos um link no seu e-mail para redefinir sua senha."
                )
            )
            .catch(() =>
                Alert.alert(
                    "Redefinir Senha",
                    "N??o foi poss??vel enviar o e-mail para redefinir a senha."
                )
            );
    }

    useEffect(() => {
        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider
            value={{ signIn, signOut, forgotPassword, user, isLogging }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
