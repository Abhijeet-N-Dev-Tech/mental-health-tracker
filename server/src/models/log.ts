import {
  DataTypes,
  Sequelize,
  Model,
  Optional,
  HasManyGetAssociationsMixin,
  Association,
} from 'sequelize';
import { Activity } from './activity';

export interface LogAttributes {
  id: number;
  userId: number;
  message: string;
  createdAt?: Date;

  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  anxiety: number;
  stress: number;

  sleepHours: number;
  sleepQuality: 'poor' | 'average' | 'good';

  socialFrequency: 'none' | 'low' | 'moderate' | 'high';

  symptoms: string;

  logDate?: Date;
}

export interface LogCreationAttributes extends Optional<LogAttributes, 'id' | 'createdAt'> {}

export class Log extends Model<LogAttributes, LogCreationAttributes> implements LogAttributes {
  public id!: number;
  public userId!: number;
  public message!: string;
  public createdAt?: Date;

  public mood!: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  public anxiety!: number;
  public stress!: number;

  public sleepHours!: number;
  public sleepQuality!: 'poor' | 'average' | 'good';

  public socialFrequency!: 'none' | 'low' | 'moderate' | 'high';

  public symptoms!: string;

  public logDate?: Date;

  public readonly activities?: Activity[];

  public getActivities!: HasManyGetAssociationsMixin<Activity>;

  public static associations: {
    activities: Association<Log, Activity>;
  };
}

export default (sequelize: Sequelize) => {
  Log.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },

      message: { type: DataTypes.TEXT, allowNull: false },

      mood: {
        type: DataTypes.ENUM('excellent', 'good', 'neutral', 'bad', 'terrible'),
        allowNull: false,
      },

      anxiety: { type: DataTypes.FLOAT, allowNull: false },
      stress: { type: DataTypes.FLOAT, allowNull: false },

      sleepHours: { type: DataTypes.FLOAT, allowNull: false },
      sleepQuality: {
        type: DataTypes.ENUM('poor', 'average', 'good'),
        allowNull: false,
      },

      socialFrequency: {
        type: DataTypes.ENUM('none', 'low', 'moderate', 'high'),
        allowNull: false,
      },

      symptoms: { type: DataTypes.STRING, allowNull: false },

      logDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Log',
      timestamps: true,
      createdAt: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          name: 'unique_user_log_per_day',
          fields: ['userId', 'logDate'],
        },
      ],
    }
  );

  return Log;
};
