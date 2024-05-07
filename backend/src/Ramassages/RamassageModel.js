const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');


const Ramassage = sequelize.define('Ramassage', {


    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantiteDechets: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    // Add other columns as needed
}, {
    sequelize,
    modelName: 'Ramassage'

});
module.exports = Ramassage;
