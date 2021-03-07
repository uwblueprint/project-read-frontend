const url = process.env.REACT_APP_API_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

async function get(path) {
  const res = await fetch(url + path, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        "base64"
      )}`,
    },
  });

  return res.json();
}

// eslint-disable-next-line import/prefer-default-export
export { get };
