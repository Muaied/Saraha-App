import { findByIdAndUpdate } from "../../common/repository/index.js"
import { userModel } from "../../DB/model/index.js"
import { createToken } from "../../common/security/token.security.js"
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js"
import { ConflictException } from "../../common/exceptions/error.exception.js"

export const profile = async (account) => {
    return account
}

export const update = async (user, data) => {
    const account = await findByIdAndUpdate({
        model: userModel,
        id: user._id,
        update: data
    })
    return account
}

export const rotateToken = async (payload, user, issuer) => {
    const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000
    const currentTime = Date.now() + (30 * 60000)
    if (currentTime < accessExpiresIn) {
        throw ConflictException("Sorry we cannot create new login credentials while current access token is still available")
    }
    // const access_token = await createToken({
    //     options: {
    //         subject: user.id,
    //         expiresIn: ACCESS_TOKEN_EXPIRES_IN
    //     }
    // })
    // const refresh_token = await createToken({
    //     options: {
    //         subject: user.id,
    //         expiresIn: REFRESH_TOKEN_EXPIRES_IN
    //     },
    //     secret: REFRESH_TOKEN_SIGNATURE

    // })

    // return { access_token, refresh_token }
    return await createLoginCredentials({ user, issuer })

}