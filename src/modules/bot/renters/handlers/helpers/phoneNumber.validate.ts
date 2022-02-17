export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const isAccepted = /^(\+7|7|8)?[489][0-9]{9}$/gm.test(phoneNumber);
  return isAccepted;
};
