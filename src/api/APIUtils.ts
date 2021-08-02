import app from "firebase/config";

const url = process.env.REACT_APP_API_URL;

async function getIdToken() {
  const user = app.auth().currentUser;
  return user ? user.getIdToken() : "";
}

export const get = async (path: string): Promise<unknown> => {
  const token = await getIdToken();
  const res = await fetch(url + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.json();
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { non_field_errors } = await res.json();
    throw Error(non_field_errors);
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { non_field_errors } = await res.json();
    throw Error(non_field_errors);
  }

  return res.json();
};
