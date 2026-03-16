# Welcome to HotDog - HolbertonSchool Australia

A full-stack application for Pet care management platform.

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Backend Installation](#backend-installation)  
3. [Frontend Installation](#frontend-installation)
4. [Deployment](#deployment)
5. [License](#license)  


## Prerequisites

Before starting, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [Python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/) (for Python dependencies)  
- [Git](https://git-scm.com/)  


## Backend Installation

1. Clone the repository:

```bash
git clone https://github.com/ashleigh6734/holbertonschool-HotDog.git
cd holbertonschool-HotDog/backend
```

2. Create a virtual environment (Python backend):

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Instantiate database and seed with initial data:

```bash
python seed_data.py && python run.py
```
> The backend server should now be running at: http://127.0.0.1:5000/


## Frontend Installation

1. Open and new terminal and navigate to the Frontend folder:

```bash
cd holbertonschool-HotDog/frontend
```

2. Install dependencies:
```bash
npm install # or yarn install
```

3. Running the Application
```bash
npm run dev
```
> The frontend server should now be running at: http://localhost:5173

## Deployment
HotDog is deployed using **Render**, which hosts both the frontend and backend services.

### Services
Our app consists of two services:

| Service | Description |
|------|------|
| Frontend | React + Vite application (user interface) |
| Backend | Python Flask API handling authentication, appointments, and database operations |

Both services are connected to this GitHub repository and automatically deploy when changes are merged into **main**.

### Deployment Flow
1. Our GitHub repo is linked to Render 
2. Code is merged into the **main** on GitHub
3. Render detects the update automatically
4. Render builds the service
5. The new version is deployed online

### Environment Variables
The backend requires the following in Render:
- JWT_SECRET_KEY
- SENDGRID_API_KEY
- DATABASE_URL

### Live Application
- Frontend: https://holbertonschool-hotdog.onrender.com (our entry main point, accessed directly by users)
- Backend API: https://holbertonschool-hotdog-backend.onrender.com (not meant to be accessed directly by users, instead, the frontend sends requests to this API to perform actions and retrieve data.

#### How the application flow works:
1. User opens the frontend link
2. Frontend sends API requests
3. Backend processes the request
4. Database retrieves data
5. Backend returns response
6. Frontend displays the result to the user

### Useful Render Locations
- Logs (check this for the affected service when debugging): Under Monitor on the left nav bar, select Logs)
- Manual Deploy: My Projects -> Production -> select the backend/frontend service -> Manual Deploy (black button) -> select how you want to deploy (at the latest commit, specific commit)

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.
