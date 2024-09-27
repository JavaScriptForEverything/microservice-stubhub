
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

## Project Setup
```
$ yarn add express
$ yarn add -D @types/node @types/express typescript ts-node-dev
$ yarn tsc --init

```
### app.ts
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

### Dockerfile
```
FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

CMD [ "yarn", "dev" ]
```

### .dockerignore
```
node_modules
```

```
Build Image:
$ docker image build -t javascriptforeverything/auth
```

### Generate Deployment file
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

### infra/k8s/auth-deploy.yaml
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
$ skaffold init  			# Generate bellow output
...
```

#### /skaffold.yaml
```
...
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: stubhub
build:
  local:
    push: false                                 # (default) don't push to dockerHub
  artifacts:
    - context: auth 			        # Apply for directory auth 
      image: javascriptforeverything/auth
      docker:
        dockerfile: Dockerfile
manifests:
  rawYaml:
    - infra/k8s/*

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


## Create Ingress for access app

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

Browser: http://mydomain.com/api/users/me 		# => { ... }
```


