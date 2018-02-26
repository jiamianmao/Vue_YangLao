function required(fieldName) {
  return {
    required: true,
    message: `请输入${fieldName}`,
  }
}

function isMobile(fieldName) {
  return [
    required(fieldName),
    { pattern: /^\d{11}$/, message: `请输入有效的${fieldName}`, trigger: 'change' }
  ];
}

export {
  required,
  isMobile
};
