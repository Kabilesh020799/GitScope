const get = (url, props) => {
  console.log(process.env);
  return fetch(`${process.env.REACT_APP_GITHUB_URL}/${url}`, {
    headers: {
      "Authorization": `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
    ...props
  }).then((res) => res.json());
};

const post = (url, props) => {
  const data = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
    ...props,
  };
  return fetch(`${process.env.REACT_APP_GITHUB_URL}/${url}`, { ...data }).then((res) => res.json());
};

const put = (url, props) => {
  const data = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
    ...props,
  };
  return fetch(`${process.env.REACT_APP_GITHUB_URL}/${url}`, { ...data }).then((res) => res.json());
};

const deleteFn = (url, props) => {
  const data = {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_GITHUB_TOKEN}`,
    },
    ...props,
  };
  return fetch(`${process.env.REACT_APP_GITHUB_URL}/${url}`, { ...data }).then((res) => res.json());
};

const api = {
  get,
  post,
  put,
  delete: deleteFn,
};

export default api;

