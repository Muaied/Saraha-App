import { userModel } from "../../DB/model/index.js";
import { ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { findOne, createOne } from "../../common/repository/index.js"
import bcrypt from "bcrypt"
import { compare, hash } from "../../common/security/hash.security.js";
import { decryption, encryption } from "../../common/security/encryption.security.js";
import jwt from "jsonwebtoken"
import { createLoginCredentials, createToken } from "../../common/security/token.security.js";


export const signup = async ({ email, password, username, phone }) => {
    const duplicateAccount = await findOne({ model: userModel, filter: { email }, options: { select: "email" } })
    if (duplicateAccount) throw ConflictException("email is already used")
    // const salt = (await bcrypt.genSalt(12, "a")).toString();
    const account = await createOne({
        model: userModel, data: {
            email,
            password: await hash(password),

            // email, password: await bcrypt.hash(password, 12),
            // password: await hash({ plaintext: password, approach: "argon2" }),
            username,
            phone: await encryption(phone)
        }
    })
    return account

}

export const login = async ({ email, password }, issuer) => {
    const account = await findOne({ model: userModel, filter: { email } })
    if (!account) throw NotFoundException("invalid Email or Password")
    const match = await bcrypt.compare(password, account.password)
    // const match = await compare(password, account.password, "argon2")

    console.log({ FE_password: password, BE_HASH: account.password, match });

    if (!match) throw NotFoundException("invalid Email or Password")
    // account.phone = await decryption(account.phone)


    // const access_token = jwt.sign(
    //     {
    //         extra: "lol"
    //     },
    //     "muaiedmohamed",
    //     {
    //         subject: account.id,
    //         noTimestamp: true,
    //         expiresIn: 60,
    //         notBefore: 30,
    //         issuer,
    //         audience: ["ws", "x"]
    //     }
    // )


    // const access_token = await createToken({

    //     options: {
    //         subject: account.id,
    //         expiresIn: ACCESS_TOKEN_EXPIRES_IN
    //     }
    // })
    // const refresh_token = await createToken({

    //     options: {
    //         subject: account.id,
    //         expiresIn: REFRESH_TOKEN_EXPIRES_IN
    //     },
    //     secret: REFRESH_TOKEN_SIGNATURE

    // })

    // return { access_token, refresh_token };

    // return await createLoginCredentials({ payload: { sub: account._id } })
    return await createLoginCredentials({ user: account })
}