import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    hireDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number
    },
    address: {
        street: String,
        city: String,
        postalCode: String,
        country: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default mongoose.model('Employee', employeeSchema);