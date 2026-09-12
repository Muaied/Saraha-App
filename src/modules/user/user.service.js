import { userModel } from "../../DB/model/index.js";

export const signup = async ({ email, password, username }) => {
    const duplicateAccount = await userModel.findOne({ email })
    if (duplicateAccount) throw new Error("duplicate email", { cause: { status: 409 } })
    const account = await userModel.create({ email, password, username })
    return account

}

export const login = async (inputs) => {
    return []

}