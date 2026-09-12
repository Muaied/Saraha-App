import { userModel } from "../../DB/model/index.js";
import { ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { findOne, createOne } from "../../common/repository/index.js"
import bcrypt from "bcrypt"
import { hash } from "../../common/security/hash.security.js";
import { decryption, encryption } from "../../common/security/encryption.security.js";
export const signup = async ({ email, password, username, phone }) => {
    const duplicateAccount = await findOne({ model: userModel, filter: { email }, options: { select: "email" } })
    if (duplicateAccount) throw ConflictException("email is already used")
    const account = await createOne({
        model: userModel, data: {
            email,
            password: await hash(password),

            username,
            phone: await encryption(phone)
        }
    })
    return account

}

export const login = async ({ email, password }) => {
    const account = await findOne({ model: userModel, filter: { email } })
    if (!account) throw NotFoundException("invalid Email or Password")
    const match = await bcrypt.compare(password, account.password)

    console.log({ FE_password: password, BE_HASH: account.password, match });

    if (!match) throw NotFoundException("invalid Email or Password")
    account.phone = await decryption(account.phone)
    return account

}