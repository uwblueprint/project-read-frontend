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

export const get = async (
  path: string,
  csv: boolean = false
): Promise<unknown> => {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }
  return csv ? res.text() : res.json();
};

export const post = async (path: string, data: unknown): Promise<unknown> => {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.json();
};

export const put = async (path: string, data: unknown): Promise<unknown> => {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.json();
};

export const destroy = async (path: string): Promise<unknown> => {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.status;
};
