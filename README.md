# About the application

First clone the repository:

```bash
git clone https://github.com/asifrahaman13/knowledgebase.git
```


## Backend

Next enter into the backend directory.

```
cd knowledgevase_backend/
```

Create a virtual environment.

```
virtualenv .venv
```

Activate the virtual environment. In unix based system like the Linux or Mac OS you can follow the following commands:

```
source .venv/bin/activate
```

Now install the required dependencies.

```
pip install -r requirements.txt
```

**Next enter the data into the .env file.**

Now run the backend server.

```
uvicorn main:app --reload --port=5000
```

</br>

## Frontend

Next enter into the front end.

```
cd knowdledgebase_frontend/
```

Install the dependencies

```
bun install
```

Run the development server:

```
bun run dev
```
