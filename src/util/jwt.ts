export default (jwt: string) => {
  const token = jwt.split(" ")[1];
  const plainTextJSON = Buffer.from(jwt.split(".")[1], "base64").toString();
  const myUserData = JSON.parse(plainTextJSON);
  console.log('returning jwt: ' +  myUserData);
  return myUserData.id;
};
