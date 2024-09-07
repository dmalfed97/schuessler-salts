export enum ZodiacSign {
  aquarius = 'aquarius',
  pisces = 'pisces',
  aries = 'aries',
  taurus = 'taurus',
  gemini = 'gemini',
  cancer = 'cancer',
  leo = 'leo',
  virgo = 'virgo',
  libra = 'libra',
  scorpio = 'scorpio',
  sagittarius = 'sagittarius',
  capricorn = 'capricorn',
}

export const getZodiacSign = (date: Date): ZodiacSign => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Месяцы начинаются с 0

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return ZodiacSign.aquarius; // Водолей
  }
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return ZodiacSign.pisces; // Рыбы
  }
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return ZodiacSign.aries; // Овен
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return ZodiacSign.taurus; // Телец
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return ZodiacSign.gemini; // Близнецы
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return ZodiacSign.cancer; // Рак
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return ZodiacSign.leo; // Лев
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return ZodiacSign.virgo; // Дева
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return ZodiacSign.libra; // Весы
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return ZodiacSign.scorpio; // Скорпион
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return ZodiacSign.sagittarius; // Стрелец
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return ZodiacSign.capricorn; // Козерог
  }
  return ZodiacSign.capricorn
}
