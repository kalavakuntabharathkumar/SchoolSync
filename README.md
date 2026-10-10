# SchoolSync — GraphQL Timetable & Announcements

A Node.js/Express + Apollo Server GraphQL API backed by SQLite, with DataLoader resolvers and a small React/Apollo Client dashboard. The dashboard supports teacher, student, and parent display modes.

## Run the API

```bash
npm install
npm start
```

API: http://localhost:4000/graphql · health: http://localhost:4000/health

## Run the dashboard

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The client expects the API on port 4000.

## Example GraphQL query

```graphql
query {
  dashboard(role: TEACHER, userId: "1") {
    displayName
    classes { id name timetable { day period subject room } }
    announcements { title body audience }
  }
}
```

## Query efficiency

The GraphQL dashboard query fetches the related view in one request. DataLoader batches teacher, class, timetable, and audience-specific announcement lookups within a request. Inspect SQL using a SQLite trace callback or wrap the database `prepare` calls with logging to profile actual query counts. The resume figures (41 → 3 SQL queries) are targets from the project brief and should be reported as measured only after benchmarking this implementation with representative data.

## Tests

`npm test` runs resolver-focused Jest tests. The client and API are separate processes; this repository intentionally keeps the server as the root package and the dashboard in `client/`.
