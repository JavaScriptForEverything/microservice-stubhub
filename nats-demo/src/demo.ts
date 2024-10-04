enum Subjects {
	ticketCreated = 'tickets/created',
	orderCreated = 'orderr/created',
}

type TicketCreatedEvent = {
	subject: Subjects.ticketCreated
	data: {
		name: string
		price: number
		serialNo: string
	}
}

type MyEvent = {
	subject: string
	data: any
}

type Listener<T extends MyEvent> = {
	subject: T['subject']
	data: T['data']
}

// type SubjectOneData = {
// 	name: string
// 	price: number
// 	serialNo: string
// }
// type SubjectTwoData = {
// 	id: string
// 	price: number
// 	cost: number
// }

const myFunc = (arg: Listener<TicketCreatedEvent>): TicketCreatedEvent => {
	
	return {
		subject: arg.subject,
		data: {
			name: 'string',
			price: 200,
			serialNo: 'string'
		},
	}
}

const subjectItems = [
	{
		subject: '',
		data: {
			name: 'string',
			price: 200,
			serialNo: 'string'
		},
	},
	{
		subject: '',
		data: {
			name: 'string',
			price: 200,
			serialNo: 'string'
		},
	},
]