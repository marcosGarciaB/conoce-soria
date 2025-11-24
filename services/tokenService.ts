
interface TokenPayload {
    id: string;
    username: string;
    email: string;
    exp: number;
}

export const getEmailFromToken = (token: string) => {
    try {
        //const decoded = jwt-decode<TokenPayload>(token);
        //return decoded.email;
    } catch (error) {
        console.error("Token inválido", error);
        return null;
    }
};

