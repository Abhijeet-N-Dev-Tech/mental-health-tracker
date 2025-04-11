export const moodOptions = ['excellent', 'good', 'neutral', 'bad', 'terrible'];
export const sleepQualityOptions = ['poor', 'average', 'good'];
export const activityTypeOptions = ['exercise', 'reading', 'meditation', 'work', 'hobby', 'walking', 'running', 'yoga', 'other'];
export const socialFrequencyOptions = ['none', 'low', 'moderate', 'high'];

export type Mood = typeof moodOptions[number];
export type SleepQuality = typeof sleepQualityOptions[number];
export type ActivityType = typeof activityTypeOptions[number];
export type SocialFrequency = typeof socialFrequencyOptions[number];
