import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js'

// Define the waitlist model (User)
const farmer = sequelize.define('User', {
  farmerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,  // auto-increments farmer id
    primaryKey: true      // primaryKey
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('fullName', value.trim());  // Trims the whitespace for fullName
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 14],  // Allows a length of 10 (local) to 14 (with international format)
    }
  },  
  notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

export default farmer;