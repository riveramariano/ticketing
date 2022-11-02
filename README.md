# Ticketing

**_Notes: You need to have docker, docker kubernetes installed._**

## Functionality

This project is a StubHub clone application, where the users can sell and buy tickets for entertaiment events.

### Microservices List

- Auth (in charge of the user auth)
- Common (in charge common logic for all modules)
- Expiration (in charge of changing orders status)
- Orders (in charge of managing orders)
- Payments (in charge of managing orders payment)
- Tickets (in charge of managing tickets)

### Run Locally

- Clone the repository `https://github.com/riveramariano/ticketing.git`
- Download Ingress-NGinx:
  - Refer to `https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop`
  - After the installation run `kubectl get ns` to confirm it
- Download Skkafold:
  - Refer to `https://skaffold.dev/docs/install/`
- Open a console for each microservice and the ui folder:
  - Run `npm install` for the dependencies
  - Inside each console run `docker build -t your-docker-id/microservice-name .` to create an image
- Run `docker push your-docker-id/microservice-image` for each image you created to push them to Docker Hub
- Go to each `.yaml` file inside `./kubernetes` and change all `riveramariano` references to `your-docker-id`
- Open a console inside the root folder and run `skaffold dev`, this will run all the deployment config files
  - If the first time fail, shut it down a re-run it
- In a File Explorer go to `C:\Windows\System32\drivers\etc`:
  - Add `127.0.0.1 ticketing.com` on the last line of your `hosts` file
- Open a web browser and go to `ticketing.com`, the react app should be running
