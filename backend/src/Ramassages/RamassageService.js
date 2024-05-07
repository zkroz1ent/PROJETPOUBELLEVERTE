
const RamassageModel = require('./RamassageModel'); // A Sequelize model, for instance

// Create a new ramassage (collection)
exports.createRamassage = async (ramassageData) => {
    try {
        const ramassage = await RamassageModel.create(ramassageData);
        return ramassage;
    } catch (error) {
        // Handle errors, e.g., validation errors or DB connection errors
        console.error('Error creating ramassage:', error);
    }
};

// Retrieve all ramassages
exports.getAllRamassages = async () => {
    try {
        const ramassages = await RamassageModel.findAll();
        return ramassages;
    } catch (error) {
        console.error('Error retrieving ramassages:', error);
    }
};

// Retrieve a single ramassage by ID
exports.getRamassageById = async (id) => {
    try {
        const ramassage = await RamassageModel.findByPk(id);
        return ramassage;
    } catch (error) {
        console.error('Error retrieving ramassage:', error);
    }
};

// Update a ramassage
exports.updateRamassage = async (id, updateData) => {
    try {
        const [updateCount, updatedRamassages] = await RamassageModel.update(updateData, {
            where: { id },
            returning: true // This is specific to Sequelize
        });
        return updatedRamassages[0];
    } catch (error) {
        console.error('Error updating ramassage:', error);
    }
};

// Delete a ramassage
exports.deleteRamassage = async (id) => {
    try {
        const deleteCount = await RamassageModel.destroy({
            where: { id }
        });
        return deleteCount;
    } catch (error) {
        console.error('Error deleting ramassage:', error);
    }
};
