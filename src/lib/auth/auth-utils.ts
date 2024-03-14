export const dicebearAvatar = (email: any) => {
  const avatar = `https://api.dicebear.com/7.x/thumbs/png?seed=${email}`;
  return avatar;
};
