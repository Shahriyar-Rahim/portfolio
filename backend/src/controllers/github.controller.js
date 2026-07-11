const normalizeRepo = (repo) => ({
  id: repo.id,
  name: repo.name,
  description: repo.description || "Featured project from the portfolio",
  language: repo.language || "Mixed",
  html_url: repo.html_url,
  updated_at: repo.updated_at,
  stargazers_count: repo.stargazers_count || 0,
});

const getGitHubRepos = async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username) {
      return res.status(200).json({
        success: true,
        data: [
          {
            id: 1,
            name: "portfolio",
            description: "MERN portfolio experience",
            language: "JavaScript",
            html_url: "https://github.com",
            updated_at: new Date().toISOString(),
            stargazers_count: 0,
          },
          {
            id: 2,
            name: "embedded-logger",
            description: "Firmware telemetry dashboard",
            language: "C",
            html_url: "https://github.com",
            updated_at: new Date().toISOString(),
            stargazers_count: 0,
          },
          {
            id: 3,
            name: "iot-hub",
            description: "Device orchestration toolkit",
            language: "TypeScript",
            html_url: "https://github.com",
            updated_at: new Date().toISOString(),
            stargazers_count: 0,
          },
        ],
      });
    }

    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-backend",
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=6&sort=updated`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`GitHub API failed with ${response.status}`);
    }

    const repos = await response.json();
    const payload = Array.isArray(repos) ? repos.map(normalizeRepo) : [];

    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: "Unable to fetch GitHub projects right now",
      error: error.message,
    });
  }
};

const githubController = { getGitHubRepos };
export default githubController;
