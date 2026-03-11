export const getUserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
};

export const formatToUserTime = (timestamp) => {
  if (!timestamp) {
    return '--';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const formatted = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: getUserTimeZone(),
    timeZoneName: 'short',
  }).format(date);

  return formatted
    .replace(/\bam\b/g, 'AM')
    .replace(/\bpm\b/g, 'PM');
};
