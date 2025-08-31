# Customer Management System

A comprehensive web application for managing gym/fitness center customers with check-in/check-out functionality, membership tracking, and user authentication.

## 🚀 Features

- **Customer Management**: Add, edit, delete, and view customer profiles
- **Check-in/Check-out System**: Track customer visits in real-time
- **Membership Tracking**: Monitor membership types (Basic, Silver, Gold) and expiration dates
- **Search & Filter**: Find customers by name and filter by status, type, or membership
- **User Authentication**: Role-based access control (Admin/User)
- **Visit History**: Track customer check-in history and patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [Git](https://git-scm.com/)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Aqua-Venture-Management-System.git
   ```

2. **Install backend dependencies**
   ```bash
   to the root directory
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd Frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=Add mongo Url here
   JWT_SECRET=Add secret here
   PORT=3000
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The application will open at `http://localhost:3001`

## 📱 Usage

### Customer Management
- **Add Customer**: Click "Add New Customer" to register a new member
- **Search**: Use the search bar to find customers by name
- **Filter**: Filter customers by check-in status, membership type, or customer type
- **Edit**: Click "Edit" to update customer information
- **Delete**: Admin users can delete customer records

### Check-in System
- **Check In**: Click "Check In" when a customer arrives
- **Check Out**: Click "Check Out" when a customer leaves
- **History**: View detailed check-in history for each customer

### User Roles
- **Admin**: Full access to all features including customer deletion
- **Staff**: Can manage customers and check-ins but cannot delete and edit records

## 🔐 Authentication

The system uses JWT-based authentication with role-based access control:

- Register new users through the admin panel
- Login with username/email and password
- Different permissions based on user role (Admin/User)

## 📊 Customer Data Structure

```javascript
{
  Name: String,
  phone: String,
  cutomerType: "member" | "monthly",
  monthlyAccess: "Basic" | "Silver" | "Gold",
  status: "active" | "inactive",
  isCheckedIn: Boolean,
  createdAt: Date,
  expireAt: Date,
  monthlyExpires: Date
}
```

## 🛣️ API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `POST /api/customers/:id/checkIn` - Check in customer
- `POST /api/customers/:id/checkOut` - Check out customer

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /current-user` - Get current user info






## ⚙️ Configuration

### Database Configuration
The application connects to MongoDB. Update the connection string in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/your-database-name
# Or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```



## 📈 Performance


- Real-time updates for check-in/check-out status
- Efficient filtering and search capabilities
  
## UI
<img width="1839" height="922" alt="image" src="https://github.com/user-attachments/assets/f2ccaa14-0e0b-4430-8282-e7aadbb734f1" />
Login Page
<img width="1920" height="1012" alt="image" src="https://github.com/user-attachments/assets/dea03c27-7357-4969-b5f4-fcf02d3ad91f" />
Dashboard
<img width="1907" height="967" alt="image" src="https://github.com/user-attachments/assets/12e64497-c014-4e4b-8f09-412c78bf0247" />
Customer page
<img width="1897" height="969" alt="image" src="https://github.com/user-attachments/assets/6d43954b-c2d2-416b-bdb2-031df3dfaa4a" />
Check in System
<img width="1920" height="993" alt="image" src="https://github.com/user-attachments/assets/e12e61e8-e0ad-4c89-a1ef-d58570af4bed" />
Temporary Reports page

<img width="1920" height="980" alt="image" src="https://github.com/user-attachments/assets/73ce3cd0-2b9c-43d3-9d92-2e1e6923bf3d" />
User management 
<img width="1678" height="998" alt="image" src="https://github.com/user-attachments/assets/93e61f7a-c9fe-41fa-b2fc-f760c7ae251e" />
Profile Page
---

**Built with  by John Rohan C. Acebo**
