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
HotDog is deployed using **Render**, which hosts both frontend and backend services

### Services
| Service | Description |
|------|------|
| Frontend | React + Vite application (user interface) |
| Backend | Python Flask API handling authentication, appointments, and database operations |

Both services are connected to this GitHub repository and automatically deploy when changes are merged into **main**.

### Environment Variables
Note the backend service requires the following:
- SENDGRID_API_KEY
- DATABASE_URL
- JWT_SECRET_KEY

### Live Application
- Frontend: **https://holbertonschool-hotdog.onrender.com** (main entry point of the application, accessed directly by users)
- Backend: **https://holbertonschool-hotdog-backend.onrender.com** (is not meant to be accessed directly by users, instead, the frontend sends requests to this API to perform actions and fetch data)
#### How the application flow works:
  User opens the frontend link  
  ↓  
  Frontend sends API requests  
  ↓  
  Backend processes the request  
  ↓  
  Database retrieves data  
  ↓  
  Backend returns response  
  ↓  
  Frontend displays the result to the user

### Useful Render Locations
- If deployment issues occur, check the **Render dashboard logs** for the affected service.
  -  Under Monitor → select Logs
- Manual Deploy: My Projects → Production → Service Name → select the frontend/backend service → Manual Deploy 


## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.
