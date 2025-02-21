const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/softwarestoreDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Database Connection Failed:', err));

// 🔹 Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "default.jpg" } // Default profile picture
});
const Admin = mongoose.model('Admin', adminSchema);

// 🔹 Create New Admin Function
async function createAdmin(username, password, profilePic) {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        console.log(`⚠️ Admin "${username}" already exists.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    await Admin.create({ username, password: hashedPassword, profilePic });

    console.log(`✅ Admin "${username}" created successfully.`);
}

// Example: Add Maxim and Anuar
async function createDefaultAdmins() {
    await createAdmin("Maxim", "admin", "maxim.jpg");
    await createAdmin("Anuar", "admin", "anuar.jpg");
    process.exit(); // Exit after creating admins
}
createDefaultAdmins();
