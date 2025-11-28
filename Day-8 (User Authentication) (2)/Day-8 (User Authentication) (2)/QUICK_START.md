# Quick Start Guide

## Error: "Request failed with status code 404"

This error means the **backend server is not running**.

## Solution - Start the Server:

### Option 1: Use Batch File (Easiest)
Double-click `START_PROJECT.bat` in the root folder

### Option 2: Manual Start

**Terminal 1 - Start Backend:**
```bash
cd "Day-8 (User Authentication)\Day-8 (User Authentication)\Server"
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd "Day-8 (User Authentication)\Day-8 (User Authentication)\Admin"
npm run dev
```

## Important:
- Backend runs on: http://localhost:8080
- Frontend runs on: http://localhost:5173
- MongoDB must be running on port 27017

## Test:
1. Start both servers
2. Go to http://localhost:5173
3. Try forgot password - should work now!

## Super Admin Login:
- Email: sadmin@gmail.com
- Password: sAdmin@123