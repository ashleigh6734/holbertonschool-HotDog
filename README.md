# Welcome to HotDog - HolbertonSchool Australia

A full-stack application for Pet care management platform.

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Backend Installation](#backend-installation)  
3. [Frontend Installation](#frontend-installation)
4. [License](#license)  


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


## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.
