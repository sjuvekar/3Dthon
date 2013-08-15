/* Object/Relational mapping for instances of the User class.
     - classes correspond to tables
     - instances correspond to rows
    - fields correspond to columns
In other words, this code defines how a row in the postgres order table
maps to the JS Order object.
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    user_id: {type: DataTypes.STRING, unique: true, allowNull: false},
    name: {type: DataTypes.STRING},
    auth_as: {type: DataType.STRING},
    time: {type: DataTypes.STRING, allowNull: false}
  });
};
