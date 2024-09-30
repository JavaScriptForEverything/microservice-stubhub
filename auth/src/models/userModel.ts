import type { Document, Model} from 'mongoose';
import { model, models, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail'
import bcryptjs from 'bcryptjs'

type UserDocument = Document & {
	name: string
	email: string
	password: string
	confirmPassword: string | undefined

	comparePassword: (password: string) => Promise<boolean> 								// .methods.func = () => {} inside Document
}

type UserModel =  Model<UserDocument> & {
	// authenticate(password: string, hashedPassword: string): boolean 	// .statics.func = () => {} inside Model
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
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	confirmPassword: {
		type: String,
		required: true,
		validate: function(this: UserDocument, val: string, ) {
			return this.password === val
		},

	},
}, { 
	timestamps: true,
	toJSON: {
		transform: (doc, ret) => { 		// only override object when JSON.stringify( doc ), not doc at all
			ret.id = ret._id
			delete ret._id 							// delete after set

			delete ret.password
			delete ret.__v
		}
	}
})


userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return next()

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})


userSchema.methods.comparePassword = function(this: UserDocument, password: string ) {
	return bcryptjs.compare(password.trim(), this.password)
}


// Method-1: 
const User = model<UserDocument, UserModel>('User', userSchema)

// Method-2: 
// const User: UserModel = (models.User as UserModel) || model<UserDocument, UserModel>('User', userSchema)
export default User


