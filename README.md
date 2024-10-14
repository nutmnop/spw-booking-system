# SPW-BOOKING-SYSTEM

The spw-booking-system is the booking system to reserve the table in beautiful spw restaurant.

## Installation

1. Clone the repository

```bash
git clone https://github.com/nutmnop/spw-booking-system.git
cd spw-booking-system
```

2. Install dependencies (for local development)
```bash
npm install
```

## Running the Application
- Without Docker
```bash
npm run build
npm start
```
The application will be running on http://localhost:3000

- With Docker
```bash
docker build -t spw-booking-system .
docker run -p 3000:3000 spw-booking-system
```
The application will be running on http://localhost:3000

## Test
To run unit test please run:
```bash
npm run test
```

## API Endpoints

- `GET /health` - To health check the service
- `POST /api/v1/config/init` - To initiate your restaurant with body `{ "tableNumbers": <int> }`
- `GET /api/v1/booking` - To list all booking transaction
- `POST /api/v1/booking/reserve` - To reserve the table with body `{ "seat": <int> }`
- `GET /api/v1/booking/:id` - To get the booking transaction by id
- `DEL /api/v1/booking/:id/cancel` - To cancel booking by id

## Note

To run linter properly please make sure to change file type of `eslint.config.mjs.txt` to `eslint.config.mjs` due to email file compression constraint

#### Disclaimer
I apologize for not being able to complete the unit and integration tests for this project. Due to time constraints, the tests were not fully implemented. However, I have ensured that the core functionality of the application is working as expected.
