import jwtDecode from "jwt-decode";

const checkTokenExpiration = (aToken: any): string => {
    let isExpired;
    let tkDecoded: any = jwtDecode(aToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (tkDecoded.exp < currentTime) {
        console.log('El token ha expirado.');
        isExpired = "";
    } else {
        console.log('El token aún es válido.');
        isExpired = tkDecoded.email;
    }
    return isExpired;
}

export default {
    checkTokenExpiration,
};
