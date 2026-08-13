import { API_BASE_URL } from "./constants/api";
import { getStorage } from "./utils/common-utils";

export class ApiError extends Error {
  constructor(message, response, details) {
    super(message);
    this.name = "ApiError";
    this.status = response.status;
    this.rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    this.rateLimitReset = response.headers.get("x-ratelimit-reset");
    this.details = details;
  }
}

const request = async (url, options = {}) => {
  const token = getStorage("token");
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/vnd.github+json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_BASE_URL || ""}/api/github/${String(url).replace(/^\/+/, "")}`,
    { ...options, headers }
  );

  if (!response.ok) {
    const body = await response.clone().json().catch(() => null);
    const message =
      body?.message ||
      (response.status === 429 || response.headers.get("x-ratelimit-remaining") === "0"
        ? "GitHub API rate limit exceeded. Please try again later."
        : `GitHub request failed (${response.status})`);
    throw new ApiError(message, response, body);
  }
  return response;
};

const api = {
  get: (url, options = {}) => request(url, { ...options, method: "GET" }),
  post: (url, options = {}) => request(url, { ...options, method: "POST" }),
  put: (url, options = {}) => request(url, { ...options, method: "PUT" }),
  delete: (url, options = {}) => request(url, { ...options, method: "DELETE" }),
};

export default api;
