export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateProjectName = (name) => {
  return name.length > 0 && name.length <= 50;
};

export const validateFileName = (name) => {
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(name) && name.length > 0;
};

export const validateFolderName = (name) => {
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(name) && name.length > 0;
};