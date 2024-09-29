import * as jwt from 'jsonwebtoken'
// import dotenv from 'dotenv' 					// no need, kubernetes secret handles it in Pod.env
// dotenv.config()

export type TokenPayload = {
	id?: string
	exp?: number | undefined;
	iat?: number | undefined;
}

const { JWT_AUTH_TOKEN_SECRET='' } = process.env
if(!JWT_AUTH_TOKEN_SECRET) throw new Error(`${JWT_AUTH_TOKEN_SECRET}`)

export const generateAuthToken = async (id: string) => {
	return jwt.sign({ id }, JWT_AUTH_TOKEN_SECRET, { expiresIn: '10h' })
}
export const verifyAuthToken = async (authToken: string) => {
	return jwt.verify(authToken, JWT_AUTH_TOKEN_SECRET) as TokenPayload
}
