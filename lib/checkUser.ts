const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export default function checkUser(username: string, password: string) {
  if (username !== USERNAME || password !== PASSWORD) {
    return false;
  }

  return true;
}
