import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface ActivityAttributes {
  id: number;
  logId: number;
  type: 'exercise' | 'reading' | 'meditation' | 'work' | 'hobby' | 'walking' | 'running' | 'yoga' | 'other';
  duration: number; // in minutes
}

export interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: number;
  public logId!: number;
  public type!: 'exercise' | 'reading' | 'meditation' | 'work' | 'hobby' | 'walking' | 'running' | 'yoga' | 'other';
  public duration!: number;
}

export default (sequelize: Sequelize) => {
  Activity.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    logId: { type: DataTypes.INTEGER, allowNull: false },

    type: {
      type: DataTypes.ENUM('exercise', 'reading', 'meditation', 'work', 'hobby', 'walking', 'running', 'yoga', 'other'),
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Activity',
    timestamps: false,
  });

  return Activity;
};
