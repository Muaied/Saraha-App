import jwt from "jsonwebtoken"
import { ACCESS_USER_TOKEN_SIGNATURE, REFRESH_USER_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, ACCESS_ADMIN_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE } from "../../config.js"
import { BadRequestException, NotFoundException } from "../exceptions/error.exception.js"
import { findById } from "../repository/base.repository.js"
import { userModel } from "../../DB/model/index.js"
import { TokenTypeEnum } from "../enum/security.enum.js"
import { RoleEnum } from "../enum/user.gender.js"

export const createToken = ({
    payload = {},
    options = {},
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.sign(payload, secret, options)
}

export const verifyToken = async ({
    token = "",
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.verify(token, secret)
}

const getTokenSignature = ({ role = RoleEnum.USER } = {}) => {
    let signatures;
    switch (role) {
        case RoleEnum.ADMIN:
            signatures = { accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE }
            break;
        default:
            signatures = { accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE }
            break;
    }
    return signatures
}

const getSignature = ({ tokenType = TokenTypeEnum.ACCESS, role = RoleEnum.USER } = {}) => {
    const signatures = getTokenSignature({ role })
    return tokenType == TokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}


export const decodeToken = async ({
    authorization = "",
    tokenType = TokenTypeEnum.ACCESS
} = {}) => {
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : authorization
    const decoded = jwt.decode(token)
    if (!decoded?.aud?.length) {
        throw BadRequestException("missing token payload")
    }
    const role = parseInt(decoded.aud[0])
    const payload = await verifyToken({ token, secret: getSignature({ tokenType, role }) })
    if (!payload?.sub) {
        throw BadRequestException("missing token payload")
    }
    const user = await findById({
        model: userModel,
        id: payload.sub
    })
    if (!user) {
        throw NotFoundException("invalid user")
    }
    return { payload, user }
}

export const createLoginCredentials = async ({
    user,
    role = RoleEnum.USER,
    options = {},
    issuer = ""
} = {}) => {
    const { accessSignature, refreshSignature } = getTokenSignature({ role: user.role })
    const access_token = await createToken({
        payload: { sub: user._id },
        secret: accessSignature,
        options: {
            ...options,
            ...(issuer && { issuer }),
            audience: [String(user.role)],
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
    })
    const refresh_token = await createToken({
        payload: { sub: user._id },
        options: {
            ...options,
            ...(issuer && { issuer }),
            audience: [String(user.role)],
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        },
        secret: refreshSignature
    })
    console.log({ access_token, refresh_token });


    return { access_token, refresh_token }
}