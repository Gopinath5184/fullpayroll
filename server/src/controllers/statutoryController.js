const Statutory = require('../models/Statutory');

// @desc    Get statutory config for auth user's org
// @route   GET /api/statutory
// @access  Private (Admin)
const getStatutoryConfig = async (req, res) => {
    // Assuming user has organizationId linked or finding via linkage
    // For simplicity, we might need to look up the organization ID from the user
    const config = await Statutory.findOne({ organization: req.user.organization });

    if (config) {
        res.json(config);
    } else {
        // Return defaults if not found, or empty object
        res.json({});
    }
};

// @desc    Update statutory config
// @route   PUT /api/statutory
// @access  Private (Admin)
const updateStatutoryConfig = async (req, res) => {
    const { pf, esi, professionalTax } = req.body;

    let config = await Statutory.findOne({ organization: req.user.organization });

    if (config) {
        config.pf = pf || config.pf;
        config.esi = esi || config.esi;
        config.professionalTax = professionalTax || config.professionalTax;

        const updatedConfig = await config.save();
        res.json(updatedConfig);
    } else {
        const newConfig = await Statutory.create({
            organization: req.user.organization,
            pf,
            esi,
            professionalTax
        });
        res.status(201).json(newConfig);
    }
};

module.exports = { getStatutoryConfig, updateStatutoryConfig };
