export default (jwt: string) => {
  const myUserData = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
  return myUserData.id;
};
