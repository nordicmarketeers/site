// Match skill with their level and label
export function combineSkills(skills, skillLevels, listingFieldsConfig) {
  if (!skills || !skillLevels) return;

  const skillsConfig = listingFieldsConfig.find(field => field.key === 'skills');

  const labelMap =
    skillsConfig?.enumOptions?.reduce((acc, option) => {
      acc[option.option] = option.label;
      return acc;
    }, {}) || {};

  return skills.map(item => {
    const skill = typeof item === 'string' ? item : item.skill;

    return {
      skill,
      label: labelMap[skill] ?? skill,
      level: skillLevels?.[skill] ?? null,
    };
  });
}

// Filter out skill where only skill or only skill level was selected
export function sanitizeSkills(arr) {
  if (!Array.isArray(arr)) return [];

  return arr.filter(
    item =>
      item &&
      typeof item.skill === 'string' &&
      item.skill.trim() !== '' &&
      item.level !== undefined &&
      item.level !== null &&
      item.level !== ''
  );
}

// Functions for formatting skills and skill_levels before submitting
export function valuesArray(arr) {
  return arr.map(item => item.skill);
}

export function valuesObject(arr) {
  return arr.reduce((acc, item) => {
    acc[item.skill] = item.level;
    return acc;
  }, {});
}
