import app from "../firebase/config";

const url = process.env.REACT_APP_API_URL;

async function getIdToken() {
  const user = app.auth().currentUser;
  return user ? user.getIdToken() : "";
}

async function get(path) {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

// eslint-disable-next-line import/prefer-default-export
export { get };
