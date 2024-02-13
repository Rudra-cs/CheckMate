import { atom } from "recoil";

export const usernameStore = atom({
    key: "username", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});
