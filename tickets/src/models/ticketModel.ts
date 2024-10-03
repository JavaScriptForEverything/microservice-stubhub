import type { Document, Model} from 'mongoose';
import { model, models, Schema, Types } from 'mongoose';

type TicketDocument = Document & {
	userId: Types.ObjectId,
	name: string
	price: string

}

type TicketModel =  Model<TicketDocument> & {
	// authenticate(password: string, hashedPassword: string): boolean 	// .statics.func = () => {} inside Model
}


const ticketSchema = new Schema<TicketDocument>({
	userId: {
		type: Schema.Types.ObjectId,
		// ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	price: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},

}, { 
	timestamps: true,
	toJSON: {
		transform: (doc, ret) => { 		// only override object when JSON.stringify( doc ), not doc at all
			ret.id = ret._id
			delete ret._id 							// delete after set
			delete ret.__v
		}
	}
})





const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema)
export default Ticket


