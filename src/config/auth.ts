import { auth } from "colyseus";

/**
 * Dummy Auth Module Setup
 * -----------------------
 * 
 * - This is a dummy auth module setup for testing purposes.
 * - It is not recommended to use this in production.
 */

const fakeDb: any[] = [];
auth.settings.onFindUserByEmail = async (email) => {
    const userFound = fakeDb.find((user) => user.email === email);;
    console.log("onFindUserByEmail", userFound);
    // return a copy of the user object
    return userFound && JSON.parse(JSON.stringify(userFound));
};

auth.settings.onRegisterWithEmailAndPassword = async (email, password) => {
    const user = { email, password, name: email.split("@")[0], errorServerIsStringButClientIsInt: "this should not crash the client", someAdditionalData: true, };
    fakeDb.push(JSON.parse(JSON.stringify(user))); // keep a copy of the user object
    return user;
};

auth.settings.onRegisterAnonymously = async (options) => ({
    anonymousId: Math.round(Math.random() * 1000), anonymous: true, ...options
});
