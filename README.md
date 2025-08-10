# ExamGuardian
A comprehensive online examination platform with AI-powered proctoring, real-time monitoring, and advanced analytics for secure remote testing <cite/>.

## 🚀 Features

### For Teachers
- **Exam Creation & Management**: Create comprehensive exams with customizable parameters [1](#1-0) 
- **Real-time Monitoring**: Monitor student activities during exams with security alerts [2](#1-1) 
- **AI-Powered Analytics**: Get intelligent insights on exam performance and question effectiveness <cite/>
- **Submission Tracking**: View and analyze all student submissions with detailed reports [3](#1-2) 

### For Students
- **Secure Testing Environment**: Take exams in a controlled, proctored environment [4](#1-3) 
- **Real-time Validation**: Instant feedback and answer validation during exams <cite/>
- **Results & Analytics**: View detailed performance analysis and historical results <cite/>

### Security Features
- **AI Proctoring**: Advanced AI detection for suspicious activities [5](#1-4) 
- **Cheating Detection**: Monitor for multiple faces, cell phones, and prohibited objects [6](#1-5) 
- **Full-screen Mode**: Automatic test termination if students exit full-screen [7](#1-6) 
- **Tab Switching Detection**: Automatic blocking when students switch tabs [8](#1-7) 

## 🛠 Technology Stack

### Backend
- **Express.js** (4.18.2) - Web framework [9](#1-8) 
- **MongoDB** with Mongoose (7.5.0) - Database and ODM [10](#1-9) 
- **JWT Authentication** (9.0.2) - Secure token-based auth [11](#1-10) 
- **bcryptjs** (2.4.3) - Password hashing [12](#1-11) 
- **Google Generative AI** (0.24.1) - AI analytics and insights [13](#1-12) 
- **OpenAI** (5.11.0) - Additional AI capabilities [14](#1-13) 

### Frontend
- **React** (18.2.0) - UI framework
- **Material-UI** (5.13.4) - Component library
- **Redux Toolkit** (1.9.5) - State management
- **TensorFlow.js** (4.10.0) - Client-side AI/ML
- **Recharts** (3.1.0) - Data visualization

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/nirmal2604/ExamGuardian.git
cd ExamGuardian
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
```

## 🚀 Running the Application

### Development Mode
Run both frontend and backend concurrently: [15](#1-14) 
```bash
npm run dev
```

### Individual Services
**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Production
```bash
npm start
```

## 📁 Project Structure

```
ExamGuardian/
├── backend/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── views/      # React components
│   │   ├── slices/     # Redux slices
│   │   └── components/ # Reusable components
│   └── package.json
└── package.json        # Root package file
```

## 🔐 Authentication & Authorization

The system uses JWT-based authentication with role-based access control [16](#1-15) :

- **Students**: Can take exams, view results, and access their dashboard
- **Teachers**: Can create exams, monitor students, and access analytics [17](#1-16) 

## 📊 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Exams
- `GET /api/exams` - Get all exams [18](#1-17) 
- `POST /api/exams` - Create new exam (teachers only) [19](#1-18) 

### Submissions
- `POST /api/submissions` - Submit exam answers [20](#1-19) 
- `GET /api/submissions/:examId` - Get student result [21](#1-20) 
- `GET /api/submissions/exam/:examId/analytics` - Get exam analytics [22](#1-21) 

## 🤖 AI Features

ExamGuardian integrates multiple AI services for enhanced functionality:

- **Google Generative AI**: Provides intelligent exam analytics and insights
- **OpenAI**: Powers advanced question analysis and recommendations
- **TensorFlow.js**: Enables client-side proctoring and behavior analysis

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Separate permissions for students and teachers
- **Real-time Proctoring**: AI-powered monitoring during exams
- **Cheating Detection**: Multiple violation types tracked and reported

## 📈 Monitoring & Analytics

- Real-time exam monitoring dashboard
- Comprehensive violation tracking
- AI-generated performance insights
- Historical data analysis
- Question effectiveness metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License [23](#1-22) .

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**ExamGuardian** - Secure, AI-powered online examination platform for the modern educational environment.
