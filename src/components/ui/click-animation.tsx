export const clickAnimation = (event: React.MouseEvent) => {
  const elem = event.currentTarget?.classList;
  elem.add("button-click-animate");
  setTimeout(() => {
    elem.remove("button-click-animate");
  }, 400);
};
