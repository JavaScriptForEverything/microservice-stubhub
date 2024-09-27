import type { Document, Model} from 'mongoose';
import { model, models, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail'

type UserDocument = Document & {
	name: string
	email: string
	password: string
	confirmPassword: string

	comparePassword: () => boolean 								// .methods.func = () => {} inside Document
}

type UserModel =  Model<UserDocument> & {
	authenticate(): boolean 											// .statics.func = () => {} inside Model
}


const userSchema = new Schema<UserDocument>({
	name: {
		type: String,
		trim: true,
		lowercase: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		validate: isEmail,
		required: true,
	},
	password: {
		type: String,
		trim: true,
		lowercase: true,
		required: true,
	},
	confirmPassword: {
		type: String,
		trim: true,
		lowercase: true,
		required: true,
		validate: function(this: UserDocument, val: string, ) {
			return this.password === val
		},

	},
}, { timestamps: true })


userSchema.methods.comparePassword = function () {
	return true
}
userSchema.statics.authenticateUser = function () {
	return true
}

// Method-1: 
const User = model<UserDocument, UserModel>('User', userSchema)

// Method-2: 
// const User: UserModel = (models.User as UserModel) || model<UserDocument, UserModel>('User', userSchema)
export default User


const user = new User({})
user.comparePassword
user.email
// user.emails

User.authenticate() 		
