const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Event = require("./Event");
const Participant = require("./Participant");

const Registration = sequelize.define("Registration", {
  qrToken: { type: DataTypes.TEXT, allowNull: false },
});

// Relations
Event.hasMany(Registration, { foreignKey: "eventId" });
Registration.belongsTo(Event);

Participant.hasMany(Registration, { foreignKey: "participantId" });
Registration.belongsTo(Participant);

module.exports = Registration;
