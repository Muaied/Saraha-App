import bcrypt from "bcrypt";
// import argon2 from "argon2";

export const hash = async (plaintext, round = 12, minor = "b") => {
    const salt = (await bcrypt.genSalt(round, minor)).toString()
    return bcrypt.hash(plaintext, salt)
}
export const compare = async (plaintext, cipherText) => {
    return await bcrypt.compare(plaintext, cipherText)
}



//2
// export const hash = async ({ plaintext, rounds = 12, minor = "b", approach = "bcrypt" } = {}) => {
//     let cipherText = ""
//     switch (approach) {
//         case "bcrypt":
//             const salt = (await bcrypt.genSalt(rounds, minor)).toString()
//             console.log({ salt });

//             cipherText = await bcrypt.hash(plaintext, salt)
//             break;
//         case "argon2":
//             cipherText = await argon2.hash(plaintext)
//             break;
//         default:
//             break;
//     }
//     return cipherText
// }


// export const compare = async (plaintext, cipherText, approach = "bcrypt") => {
//     let match = ""
//     switch (approach) {
//         case "bcrypt":
//             match = await bcrypt.compare(plaintext, cipherText)
//             break;
//         case "argon2":
//             match = await argon2.verify(cipherText, plaintext)
//             break;
//         default:
//             break;
//     }
//     return match
// }