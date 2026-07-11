const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000;

class GitHubRateLimitError extends Error {
  constructor(retryAfter) {
    super("GitHub's public API limit has been reached. Add GITHUB_TOKEN to the backend .env to restore live project updates.");
    this.retryAfter = retryAfter;
  }
}

const githubHeaders = () => {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-backend" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
};

const getReadmeImage = async (owner, repo) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { ...githubHeaders(), Accept: "application/vnd.github.raw+json" },
    });
    if (!response.ok) return "";
    const markdown = await response.text();
    const match = markdown.match(/!\[[^\]]*\]\(([^\s)]+)/);
    if (!match?.[1]) return "";
    const image = match[1].replace(/^<|>$/g, "");
    if (/^https?:\/\//i.test(image)) return image;
    return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${image.replace(/^\.\//, "")}`;
  } catch { return ""; }
};

const normalizeRepo = async (repo) => ({
  id: repo.id,
  name: repo.name,
  description: repo.description || "Featured project from the portfolio",
  language: repo.language || "Mixed",
  html_url: repo.html_url,
  homepage: repo.homepage || "",
  updated_at: repo.updated_at,
  stargazers_count: repo.stargazers_count || 0,
  coverImage: await getReadmeImage(repo.owner.login, repo.name),
});

const fetchRepos = async () => {
  const username = process.env.GITHUB_USERNAME || "Shahriyar-Rahim";
  const cached = cache.get(username);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) return cached.repos;
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`, { headers: githubHeaders() });
  if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
    // Keep serving a previous result while GitHub's public quota resets.
    if (cached) return cached.repos;
    throw new GitHubRateLimitError(response.headers.get("x-ratelimit-reset"));
  }
  if (!response.ok) throw new Error(`GitHub API failed with ${response.status}`);
  const repos = await response.json();
  const normalized = await Promise.all((Array.isArray(repos) ? repos : []).filter((repo) => !repo.fork).map(normalizeRepo));
  cache.set(username, { createdAt: Date.now(), repos: normalized });
  return normalized;
};

const getGitHubRepos = async (req, res) => {
  try {
    const repos = await fetchRepos();
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 6, 100));
    const page = Math.max(1, Number(req.query.page) || 1);
    const start = (page - 1) * limit;
    res.status(200).json({
      success: true,
      data: repos.slice(start, start + limit),
      pagination: { page, limit, total: repos.length, totalPages: Math.max(1, Math.ceil(repos.length / limit)) },
    });
  } catch (error) {
    if (error instanceof GitHubRateLimitError) {
      if (error.retryAfter) res.set("Retry-After", String(Math.max(1, Number(error.retryAfter) - Math.floor(Date.now() / 1000))));
      return res.status(429).json({ success: false, message: error.message });
    }
    res.status(502).json({ success: false, message: "Unable to fetch GitHub projects right now", error: error.message });
  }
};

export default { getGitHubRepos };
