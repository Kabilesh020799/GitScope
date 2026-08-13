import api, { ApiError } from "./requests";

class TestHeaders {
  constructor(values = {}) {
    this.values = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key.toLowerCase(), value])
    );
  }
  get(key) { return this.values[key.toLowerCase()] ?? null; }
  has(key) { return this.get(key) !== null; }
  set(key, value) { this.values[key.toLowerCase()] = value; }
}

const response = ({ status = 200, body = null, headers = {} } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new TestHeaders(headers),
  json: jest.fn().mockResolvedValue(body),
  clone() { return this; },
});

describe("GitHub proxy requests", () => {
  beforeEach(() => {
    localStorage.clear();
    global.Headers = TestHeaders;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("routes GitHub calls through the backend with the app token", async () => {
    localStorage.setItem("token", JSON.stringify("app-jwt"));
    fetch.mockResolvedValue(
      response({ body: [], headers: { Link: "" } })
    );

    await api.get("octo/repo/commits?per_page=100");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/github\/octo\/repo\/commits\?per_page=100$/),
      expect.objectContaining({ method: "GET" })
    );
    const options = fetch.mock.calls[0][1];
    expect(options.headers.get("Authorization")).toBe("Bearer app-jwt");
  });

  it("throws a structured rate-limit error for failed responses", async () => {
    fetch.mockResolvedValue(
      response({ body: { message: "API rate limit exceeded" },
        status: 403,
        headers: {
          "X-RateLimit-Remaining": "0",
        },
      })
    );

    await expect(api.get("octo/repo/commits")).rejects.toMatchObject({
      name: "ApiError",
      status: 403,
      rateLimitRemaining: "0",
    });
    await api.get("octo/repo/commits").catch((error) => {
      expect(error).toBeInstanceOf(ApiError);
    });
  });
});
