
# ImpactNest – Backend

A RESTful API built with **Express.js and MongoDB** to power the ImpactNest community event platform. It handles event management, user participation, database operations, and authentication verification.

## 🚀 Technologies Used

<p>
  <img src="https://skillicons.dev/icons?i=express,mongodb,js" alt="Express.js, MongoDB, JavaScript" />
</p>

- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT verification using JOSE
- **Environment Variables:** dotenv
- **Middleware:** CORS

## ✨ Key Features

- RESTful API development with Express.js.
- MongoDB database integration.
- Event creation and management.
- Event participation management.
- JWT-based authentication verification.
- Cross-origin resource sharing (CORS) configuration.
- Environment-based configuration.

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | Backend framework |
| `mongodb` | MongoDB database integration |
| `jose` | JWT verification |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/badrulalambd/impactnest-community-server.git
cd impactnest-community-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
CLIENT_URL=http://localhost:3000
MONGODB_USER=your_mongodb_user
MONGODB_PASSWORD=your_mongodb_password
```

### 4. Start the Backend Server

Start the Express server using Node.js:

```bash
node index.js
```

## 🔗 Related Links

- **Live Website:** [ImpactNest](https://impactnest-community.vercel.app)
- **Frontend Repository:** [ImpactNest Frontend](https://github.com/badrulalambd/impactnest-community)
- **Backend Repository:** [ImpactNest Backend](https://github.com/badrulalambd/impactnest-community-server)

## 👨‍💻 Author

**Badrul Alam**  
Full-Stack Web Developer

- **Portfolio:** [badrulalam.me](https://badrulalam.me)
- **GitHub:** [badrulalambd](https://github.com/badrulalambd)
