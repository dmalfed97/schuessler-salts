export function calculateAge(birthDateString: string) {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Если текущий месяц меньше месяца рождения или если месяцы равны, но текущий день меньше дня рождения, уменьшаем возраст на 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
