import { Request, Response } from 'express';
import { Log, Activity } from '../models';
import { Op } from 'sequelize';

// Authenticated route check
export const isAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

export const getMe = (req: any, res: Response) => {
  res.json(req.user || null);
};

export const logout = (req: any, res: Response) => {
  req.logout((err: any) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
};

export const createLog = async (req: any, res: Response) => {
  const {
    logDate,
    message,
    mood,
    anxiety,
    stress,
    sleepHours,
    sleepQuality,
    socialFrequency,
    symptoms,
    activities
  } = req.body;

  if (!logDate || !Array.isArray(activities)) {
    res.status(400).json({ message: 'logDate and activities[] are required' });
    return;
  }

  try {
    const [log, created] = await Log.findOrCreate({
      where: {
        userId: req.user.id,
        logDate,
      },
      defaults: {
        userId: req.user.id,
        message,
        mood,
        anxiety,
        stress,
        sleepHours,
        sleepQuality,
        socialFrequency,
        symptoms: JSON.stringify(symptoms),
      },
    });

    if (!created) {
      await log.update({
        message,
        mood,
        anxiety,
        stress,
        sleepHours,
        sleepQuality,
        socialFrequency,
        symptoms: JSON.stringify(symptoms),
      });

      await Activity.destroy({ where: { logId: log.id } });
    }

    await Activity.bulkCreate(
      activities.map((a: any) => ({
        logId: log.id,
        type: a.type,
        duration: a.duration,
      }))
    );

    const fullLog = await Log.findByPk(log.id, {
      include: [{ model: Activity, as: 'activities' }]
    });

    res.json(fullLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save log' });
  }
};

export const getLogs = async (req: any, res: Response) => {
  const limit = +req.query.limit || 10;
  const offset = +req.query.offset || 0;

  const logs = await Log.findAndCountAll({
    where: { userId: req.user.id },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Activity,
        as: 'activities'
      }
    ]
  });

  res.json(logs);
};

export const getChartData = async (req: any, res: Response) => {
  const view = req.query.view === 'monthly' ? 'monthly' : 'weekly';
  const now = new Date();
  const from = new Date(view === 'weekly' ? now.setDate(now.getDate() - 7) : now.setMonth(now.getMonth() - 1));

  const rawLogs = await Log.findAll({
    where: {
      userId: req.user.id,
      logDate: {
        [Op.gte]: from,
      },
    },
    include: [{ model: Activity, as: 'activities' }],
    order: [['logDate', 'ASC']],
  });

  const grouped: Record<string, typeof rawLogs> = {};

  for (const log of rawLogs) {
    const date = new Date(log.logDate!).toLocaleDateString('en-CA');

    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(log);
  }

  const chartData = {
    sleep: [] as { date: string; sleepHours: number }[],
    activity: [] as { date: string; [type: string]: number | string }[],
  };

  for (const [date, logs] of Object.entries(grouped)) {
    const sleepAvg = logs[0].sleepHours;

    const activityTotals: Record<string, number> = {};

    for (const log of logs) {
      for (const activity of log.activities || []) {
        activityTotals[activity.type] = (activityTotals[activity.type] || 0) + activity.duration;
      }
    }

    chartData.sleep.push({ date, sleepHours: Number(sleepAvg.toFixed(1)) });
    chartData.activity.push({ date, ...activityTotals });
  }

  res.json(chartData);
};
