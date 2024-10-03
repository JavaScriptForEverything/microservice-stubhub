
## Kind Cluster Setup
```
$ which kind
$ which kubectl

$ vim cluster.yaml
---
### For Ingress
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
    - containerPort: 80    # Ingress controller listens on 80
      hostPort: 80         # Expose on host port 80
      protocol: TCP
    - containerPort: 443   # For HTTPS if needed
      hostPort: 443        # Expose on host port 443
      protocol: TCP

  - role: worker
  - role: worker
...

$ kind create cluster --config cluster.yaml
```

### Project Setup
```
$ yarn add express
$ yarn add -D @types/node @types/express typescript ts-node-dev
$ yarn tsc --init

```
#### app.ts
```
import express from 'express'

const app = express()
app.use( express.json() )

app.get('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		body: {}
	})
})

const PORT = 5000
app.listen( PORT, () => {
	console.log(`server running on : http://localhost:${PORT}`)
})
```

#### Dockerfile
```
FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

CMD [ "yarn", "dev" ]
```

#### .dockerignore
```
node_modules
```

```
Build Image:
$ docker image build -t javascriptforeverything/auth
```

#### Generate Deployment file
```
$ cd ..
$ kubectl create deployment auth-deploy \
        --image=javascriptforeverything/auth \
        --replicas=1 \
        --dry-run=client \
        -o yaml > infra/k8s/auth-deploy.yaml

$ kubectl create service --help
$ kubectl create service clusterip --help
$ kubectl create service clusterip auth-svc \
        --tcp=5000:5000 \
        --dry-run=client -o yaml >> infra/k8s/auth-deploy.yaml 
```

#### infra/k8s/auth-deploy.yaml
```
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth                   # (2) select Pod to apply replicas
  template:
    metadata:
      labels:
        app: auth                 # (1) Add label to pod
    spec:
      containers:
        - name: auth
          image: javascriptforeverything/auth:latest
          # imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5000   # App running on this port
---
apiVersion: v1
kind: Service
metadata:
  name: auth-svc
spec:
  type: ClusterIP
  selector:
    app: auth                     # (3) target pod to apply service
  ports:
  - name: 5000-5000
    targetPort: 5000              # (4) map container pod
    port: 5000                    # (5) with Cluster node port 
    protocol: TCP
...
```



### Create skaffold config file

```
$ skaffold init  			        # Generate bellow output
...
```

#### /skaffold.yaml
```
---
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: stubhub

manifests:
  rawYaml:
    - infra/k8s/*

build:
  local:
    push: false                                 # (default) don't push to dockerHub
    useBuildkit: true                           # To build image lot faster, so must use it
  artifacts:
    - image: javascriptforeverything/auth
      context: auth
      docker:
        dockerfile: Dockerfile
      sync:                                     # Instead of it, build entire image on every change, now only change updated files
        manual:
          - src: 'src/**/*.ts'                  # Take all those files 
            dest: .                             # put here

# ---
# apiVersion: skaffold/v2alpha3
# kind: Config
# deploy:
#   kubectl:
#     manifests:
#       - ./infra/k8s/*
# build:
#   local:
#     push: false                               # (default) don't push to dockerHub
#   artifacts:
#     - context: ./auth                         # will be apply for /auth dir = auth project
#       image: javascriptforeverything/auth
#       docker:
#         dockerfile: Dockerfile
#       sync:                                   # Sync all file 
#         manual:
#           - src: 'src/**/*.ts'                # Take all those files 
#             dest: .                           # put here
...


$ skaffold dev  			        # build development mode for kubernetes by skaffold
$ kubectl get podsvc 				# See pod (by deployment) runing
$ kubectl get svc 				# See services runing
```


### Create Ingress for access app

```
$ kubectl create ingress auth-svc --help | less
$ kubectl create ingress simple --rule="foo.com/bar=svc1:8080

$ kubectl create ingress simple \
        --rule="foo.com/bar=svc1:8080,tls=my-cert" \
        --dry-run=client \
        -o yaml > infra/k8s/auth-svc.yaml
```

#### infra/k8s/auth-svc.yaml
```
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: auth-svc                                        # will be used as dns to access auth service
  annotations:
    # nginx.ingress.kubernetes.io/use-regex: 'true'     # required for regex
spec:
  ingressClassName: nginx                               # apply nginx-ingress controller
  rules:
  - host: mydomain.com                 # echo '127.0.0.1   mydomain.com' | sudo tee -a /etc/hosts
    http:
      paths:
      # - path: /api/users/?(.*)
      - path: /api/users/
        pathType: Prefix
        backend:
          service:
            name: auth-svc                              # target service.name = auth-svc to apply
            port:
              number: 5000              # app running on container and also service mapped to 5000
...

$ skaffold dev 		                                # Run skafold in development mode
$ skaffold dev -v debug                                 # for more details in debug more

Browser: http://mydomain.com/api/users/me 		# => { ... }
```


# Testing Setup
```
+--------------------------------------[ Jest + Typescript ]------------------------------------+
|                                                                                               |
| Asume: 											|
| . My api handles both error and success. 			                                |
|                                                                                               |
| POST 	/api/users/register                                                                     |
| POST 	/api/users                                                                              |
| 	body:	{ 		                                                                |
| 	  "name": "riajul islam", 			                                        |
| 	  "email": "riajul@gmail.com", 					                        |
| 	  "password" : "asdfasdf", 				                                |
| 	  "confirmPassword": "asdfasdf" 				                        |
| 	} 								                        |
| 				 								|
| 	Success: { 										|
| 	  "status": "success", 									|
| 	  "data": { 						                                |
| 	    "name": "riajul islam", 	                                                        |
| 	    "email": "riajul@gmail.com", 	                                                |
| 	    "createdAt": "2024-09-30T04:37:40.032Z", 					        |
| 	    "updatedAt": "2024-09-30T04:37:40.032Z", 					        |
| 	    "id": "66fa2b14c738074803816340" 						        |
| 	  } 		                                                                        |
| 	} 											|
| 				 								|
| 	 ...											|
| 	    "email": "riajulgmail.com", 		: invalid email, throw error 	        |
| 	 ...											|
| 	Failed: { 										|
| 	  "status": 400, 									|
| 	  "statusName": "ValidationError", 							|
| 	  "message": [ 										|
| 	    "email: Validator failed for path `email` with value `riajulgmail.com`" 		|
| 	  ], 											|
|                                                                                               |
|                                                                                               |
|----------[ Example ]---------- 								|
|                                                                                               |
| Step-1. Set Up Your Project 									|
|                                                                                               |
| Initialize your project: 								        |
|                                                                                               |
| 	$ mkdir express-jest-typescript 						        |
| 	$ cd express-jest-typescript 								|
| 	$ yarn init -y 										|
|                                                                                               |
|                                                                                               |
| Install necessary dependencies: 								|
|                                                                                               |
|       $ yarn add express dotenv validator mongoose bcryptjs jsonwebtoken cookie-session 	|
|       $ yarn add -D typescript ts-node-dev @types/node @types/express @types/validator 	|
|  		@types/mongoose @types/bcryptjs @types/jsonwebtoken @types/cookie-session 	|
|                                                                                               |
|       $ yarn add -D jest ts-jest supertest mongodb-memory-server 				|
| 	$ yarn add -D @types/jest @types/supertest 						|
|                                                                                               |
|                                                                                               |
|                                                                                               |
| Step-2: Seperate express app and listener with database into different file: 			|
|  												|
| 	For testing we no need listen(), neigher we need database, because suppertest had his   |
| 	own random port to listen, so that multiple test can be perform perallely, 		|
|  												|
| 	We neighter need database, because, again we need temporary database, so that can be    |
| 	need for multiple instance for perallel request, for his own database. 			|
|  												|
|  												|
| /src/app.ts 									                |
|       import express from 'express'                                                           |
|       import morgan from 'morgan'                                                             |
|       import cookieSession from 'cookie-session'                                              |
|                                                                                               |
|       import routers  from './routes'                                                         |
|       import * as errorController from './controllers/errorController'                        |
|                                                                                               |
|                                                                                               |
|       export const app = express()                                                            |
|                                                                                               |
|       app.set('trust proxy', true) 	// because traffic will in borxy through ingress nginx  |
|                                                                                               |
|       // middlewares                                                                          |
|       app.use( express.json() )                                                               |
|       app.use(morgan('dev'))                                                                  |
|                                                                                               |
|       /* cookieSession how it works ?                                                         |
|       	if request has cookie, then cookieSession read that from cookie, and store into,|
|       	req.session, and when send response back to user, it set that session into cookie,
|       	if user modify session before sending response then modified session will be sent as cookie.
|       */                                                                                      |
|       app.use(cookieSession({ 	                                                        |
|       	signed: false, 		// no need to encrypt, jwt is already encrypted         |
|       	secure: process.env.NODE_ENV === 'production', 					|
|       }))                                                                                     |
|                                                                                               |
|       // route handlers                                                                       |
|       app.use('/', routers) 	                                                                |
|                                                                                               |
|       // global error handler                                                                 |
|       app.all('*', errorController.routeNotFound)                                             |
|       app.use(errorController.globalErrorHandler)                                             |
|  												|
| /src/server.ts 										|
|       import { app } from './app'                                                             |
|       import { dbConnect } from './models/dbConnect'                                          |
|                                                                                               |
|       const PORT = 5000                                                                       |
|       app.listen( PORT, () => {                                                               |
|       	dbConnect() 		                                                        |
|       	console.log(`server running on: http://localhost:${PORT}`)                      |
|       })                                                                                      |
|                                                                                               |
| 	const PORT = process.env.PORT || 3000  							|
|                                                                                               |
| 	app.listen(PORT, () => { 								|
| 	  console.log(`Server is running on port ${PORT}`); 					|
| 	}); 											|
|                                                                                               |
|                                                                                               |
|                                                                                               |
| Step-3: Configure jest for Typescript 		                                        |
|                                                                                               |
| /jest.config.ts 					                                        |
| 	import type { Config } from 'jest' 						        |
|                                                                                               |
| 	const config: Config = { 								|
| 		preset: 'ts-jest', 		        : Required for Typescript Interpreter 	|
| 		testEnvironment: 'node', 		: Node Engine 		                |
| 		verbose: true, 			        : Show logs 	                        |
| 		testMatch: ['**/tests/**/*.test.ts'], 	: Where tests will be checked from      |
| 		setupFilesAfterEnv: ['./jest.setup.ts'],: Run this file before every test 	|
| 	} 									                |
| 	export default config 					                                |
|                                                                                               |
|                                                                                               |
| /jest.setup.ts 									        |
| 	import { MongoMemoryServer } from 'mongodb-memory-server' 			        |
| 	import mongoose from 'mongoose' 				                        |
|                                                                                               |
| 	let mongo = new MongoMemoryServer() 	                                                |
|                                                                                               |
|	beforeAll( async () => { 							        |	
| 		await mongo.start() 	                                                        |
| 		const mongoUri = await mongo.getUri() 			                        |
|                                                                                               |
| 		await mongoose.connect( mongoUri ) 		                                |
| 	}) 											|
|                                                                                               |
| 	// To reset all data before every test 	                                                |
| 	beforeEach( async () => { 	                                                        |
| 		const collections = await mongoose.connection.db?.collections() 		|
|                                                                                               |
| 		if(!collections) return 	                                                |
| 		for( let collection of collections ) { 				                |
| 			await collection.deleteMany({}) 			                |
| 		} 										|
| 	}) 											|
|                                                                                               |
| 	afterAll( async () => { 								|
| 		await mongo.stop() 	                                                        |
| 		await mongoose.connection.close() 				                |
| 	}) 											|
|                                                                                               |
|                                                                                               |
| Step-4: Add scripts 										|
|                                                                                               |
| /package.json 					                                        |
| 	... 											|
|    "scripts": { 										|
|       "start": "node ./dest/server.ts", 							|
|   	"dev": "ts-node-dev ./src/server.ts", 							|
| 	"test:watch": "jest --watchAll --no-cache", 						|
| 	"test": "jest --no-cache" 								|
|    }, 											|
|                                                                                               |
|                                                                                               |
| Step-5: Write our test for Creating User 							|
|                                                                                               |
| ./src/tests/register.test.ts 									|
|                                                                                               |
| 	import request from 'supertest' 							|
| 	import { app } from '../src/app' 							|
|                                                                                               |
| 	describe('Register new user', () => { 			                                |
|                                                                                               |
| 	  it('POST /api/users/register', () => { 	                                        |
| 	    const body = { 			                                                |
| 	        "name": "riajul islam", 	                                                |
| 		"email": "riajul@gmail.com", 				                        |
| 		"password" : "asdfasdf", 							|
| 		"confirmPassword": "asdfasdf" 							|
| 	    } 											|
|                                                                                               |
| 	    return request(app) // Method-1: must return else use done() to tell, async task finished
| 	    .post('/api/users/register') 		                                        |
| 	    .send(body) 					                                |
|                                                                                               |
| 	    // .expect(201) 		// we handle success and error by api, so no need it    |
| 	    .then( (res) => { 							                |
| 		if(res.status === 201) { 							|
|                                                                                               |
| 		expect(res.body.status).toBe('success')     // comes from backend res.status    |
| 		expect(res.body.data).toHaveProperty('name', body.name) 	// comes from backend res.data.name
| 		expect(res.body.data).toHaveProperty('email', body.email) // comes from backend res.data.email
|                                                                                               |
| 	    } else if (res.status === 400) { 							|
|                                                                                               |
| 		expect(res.body.status).toBe(400) 	        // comes from backend appError  |
| 		expect(res.body.statusName).toBe('ValidationError') 	// comes from backend appError
|                                                                                               |
| 	    } else { 										|
| 	        throw new Error(`Unexpected status code: ${res.status}`) // Server Error 	|
|                                                                                               |
| 	    }  											|
| 	}) 											|
| 	.catch((err) => { 	        // handle those error, which my api don't handled 	|
| 		if(err.response) return console.log('Unexpected error response:', err.response.body)
|                                                                                               |
| 		console.log('Unexpected error response:', err) 				        |
| 		return err 		// required to tell supertest that, async task is done 	|
| 	}) 											|
|    }) 											|
|                                                                                               |
|                                                                                               |
| 	it('register user in 2nd way', async () => { 			                        |
|                                                                                               |
| 	    const body = { 			                                                |
| 	        "name": "riajul islam", 	                                                |
| 		"email": "riajul@gmail.com", 				                        |
| 		"password" : "asdfasdf", 							|
| 		"confirmPassword": "asdfasdf" 							|
| 	    } 											|
|                                                                                               |
| 	    const res = await request(app) 						        |
|	        .post('/api/users/register') 	                                                |
| 		.send(body) 								        |
|                                                                                               |
| 	    // expect(res.status).toBe(201)	// we handle success and error by api, so no need it here
| 	    try { 							                        |
| 		if(res.status === 201) { 							|
|                                                                                               |
| 		expect(res.body.status).toBe('success') 				        |
| 		expect(res.body.data).toHaveProperty('name', body.name) 			|
| 		expect(res.body.data).toHaveProperty('email', body.email) 			|
|                                                                                               |
| 	    } else if (res.status === 400) { 						        |
|                                                                                               |
| 		expect(res.body.status).toBe(400) 						|
| 		expect(res.body.statusName).toBe('ValidationError') 				|
|                                                                                               |
| 	    } else { 									        |
| 		throw new Error(`Unexpected status code: ${res.status}`) 			|
|                                                                                               |
| 	    } catch (err: any) {                // handle those error, which my api don't handled
|                                                                                               |
| 		if(err.response) return console.log('Unexpected error response:', err.response.body)
| 		console.log('Unexpected error response:', err) 				        |
| 	    } 											|
| 	}) 											|
|                                                                                               |
|    }) 											|
|  												|
|  												|
| Step-6: Run 											|
|                                                                                               |
| 	$ sudo systemctl start mongod 		: Make sure database running for server 	|
| 	$ yarn dev 				: Run server 					|
|                                                                                               |
| 	$ yarn test 				: Run testing (test has it's own database) 	|
|                                                                                               |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+

```