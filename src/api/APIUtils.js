import app from "firebase/config";

const url = process.env.REACT_APP_API_URL;

async function getIdToken() {
  const user = app.auth().currentUser;
  if (!user) {
    return "";
  }
  const idTokenResult = await user.getIdTokenResult();
  const lastLoggedIn = new Date(idTokenResult.authTime).getDate();
  if (lastLoggedIn !== new Date().getDate()) {
    await app.auth().signOut();
    return "";
  }

  return user.getIdToken();
}

export async function get(path) {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function post(path, data) {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function put(path, data) {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
