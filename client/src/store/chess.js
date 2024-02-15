import { atom } from "recoil";

export const usernameStore = atom({
    key: "username", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

export const orientationState = atom({
    key: "orientation", // unique ID (with respect to other atoms/selectors)
    default: "white", // default value (aka initial value)
});
