const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: String, // e.g., "Run Payroll"
    details: String,
    ip: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
