#!/usr/bin/env node

/**
 * Calculate percentage of week elapsed from Monday 4pm to next Monday 4pm
 */

function getWeekPercentage() {
  const now = new Date();

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const currentMillisecond = now.getMilliseconds();

  // Convert current day to Monday-based (0 = Monday, 1 = Tuesday, etc.)
  const mondayBasedDay = currentDay === 0 ? 6 : currentDay - 1;

  // Calculate hours since last Monday 4pm
  let hoursSinceMonday4pm;

  if (mondayBasedDay === 0) {
    // It's Monday
    if (currentHour >= 16) {
      // After 4pm on Monday
      hoursSinceMonday4pm = (currentHour - 16) + (currentMinute / 60) + (currentSecond / 3600) + (currentMillisecond / 3600000);
    } else {
      // Before 4pm on Monday - we're in the previous week
      hoursSinceMonday4pm = (6 * 24) + (currentHour + 8) + (currentMinute / 60) + (currentSecond / 3600) + (currentMillisecond / 3600000);
    }
  } else {
    // Not Monday - calculate days since Monday plus hours today
    const daysSinceMonday = mondayBasedDay;
    const hoursToday = currentHour + (currentMinute / 60) + (currentSecond / 3600) + (currentMillisecond / 3600000);
    hoursSinceMonday4pm = (daysSinceMonday * 24) + hoursToday - 16;

    // If result is negative, we're before the first Monday 4pm
    if (hoursSinceMonday4pm < 0) {
      hoursSinceMonday4pm += (7 * 24);
    }
  }

  // Total hours in a week
  const totalHoursInWeek = 7 * 24;

  // Calculate percentage
  const percentage = (hoursSinceMonday4pm / totalHoursInWeek) * 100;

  return {
    percentage: percentage,
    hoursSinceMonday4pm: hoursSinceMonday4pm,
    totalHoursInWeek: totalHoursInWeek,
    currentTime: now.toLocaleString(),
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]
  };
}

// Run the calculation
const result = getWeekPercentage();

console.log('=== Week Percentage Calculator ===');
console.log(`Current time: ${result.currentTime} (${result.dayOfWeek})`);
console.log(`Hours since Monday 4pm: ${result.hoursSinceMonday4pm.toFixed(2)}`);
console.log(`Total hours in week: ${result.totalHoursInWeek}`);
console.log(`\nWeek completion: ${result.percentage.toFixed(2)}%`);
console.log('===================================');

// Visual progress bar
const barLength = 50;
const filledLength = Math.round((result.percentage / 100) * barLength);
const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
console.log(`\n[${bar}] ${result.percentage.toFixed(1)}%\n`);
