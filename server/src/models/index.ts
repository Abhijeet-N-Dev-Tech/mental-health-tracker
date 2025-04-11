import { Sequelize } from 'sequelize';
import createUserModel, { User } from './user';
import createLogModel, { Log } from './log';
import createActivityModel, { Activity } from './activity';
import sequelize from '../config/db';

const userModel = createUserModel(sequelize);
const logModel = createLogModel(sequelize);
const activityModel = createActivityModel(sequelize);

// Associations
userModel.hasMany(logModel, { foreignKey: 'userId' });
logModel.belongsTo(userModel, { foreignKey: 'userId' });

logModel.hasMany(activityModel, { foreignKey: 'logId', as: 'activities', onDelete: 'CASCADE' });
activityModel.belongsTo(logModel, { foreignKey: 'logId' });

export { sequelize, User, Log, Activity };
