export const dicebearAvatar = (email: string | null | undefined) => {
  const avatar = `https://api.dicebear.com/7.x/thumbs/png?seed=${email}`;
  return avatar;
};
