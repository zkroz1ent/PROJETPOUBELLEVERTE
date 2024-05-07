
const RamassageService = require('./RamassageService');

exports.createRamassage = async (req, res) => {
    try {
        const ramassage = await RamassageService.createRamassage(req.body);
        res.status(201).json(ramassage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRamassages = async (req, res) => {
    try {
        const ramassages = await RamassageService.getAllRamassages();
        res.status(200).json(ramassages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRamassageById = async (req, res) => {
    try {
        const ramassage = await RamassageService.getRamassageById(req.params.id);
        if (ramassage) {
            res.status(200).json(ramassage);
        } else {
            res.status(404).json({ message: 'Ramassage not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRamassage = async (req, res) => {
    try {
        const updatedRamassage = await RamassageService.updateRamassage(req.params.id, req.body);
        res.status(200).json(updatedRamassage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRamassage = async (req, res) => {
    try {
        const deleteCount = await RamassageService.deleteRamassage(req.params.id);
        if (deleteCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Ramassage not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
