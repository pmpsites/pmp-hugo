// functions/helpers.js
// This file contains utility functions, such as for generating random strings.
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        // Append a random character from the defined set.
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}