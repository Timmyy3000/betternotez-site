const SERVER_URL = 'https://github.com/Timmyy3000/BetterNotez/releases/latest/download/betternotez-mcp.mjs'

function setupPrompt(app, register) {
  return `Please connect BetterNotez to ${app} so you can read and help with my notes. I'm not technical, so do every step yourself on my computer and only ask me if you're truly stuck.

1. Check that Node.js 22 or newer is installed (run \`node --version\`). If it isn't, install it for me (winget on Windows, Homebrew on Mac), or tell me exactly what to click.
2. Download ${SERVER_URL} into a folder that won't be moved:
   - Windows: %LOCALAPPDATA%\\BetterNotez\\mcp\\
   - Mac and Linux: ~/.betternotez/mcp/
3. Register it as an MCP server named "betternotez" that runs:
   node "<full path of the downloaded file>"
   It reads the "BetterNotez Library" folder in my home folder, which the BetterNotez desktop app creates.
${register}
4. Read the config back and check it's valid. Then tell me to quit ${app} completely, open it again, and ask "List my BetterNotez subjects".`
}

const CLAUDE = setupPrompt(
  'Claude',
  `   Keep any settings that are already there.
   - Claude Desktop: add it under "mcpServers" in claude_desktop_config.json (Windows: %APPDATA%\\Claude\\, Mac: ~/Library/Application Support/Claude/). Use forward slashes in paths so the JSON stays valid.
   - Claude Code: run \`claude mcp add --scope user betternotez -- node "<file>"\`.`,
)

const CODEX = setupPrompt(
  'ChatGPT or Codex',
  `   Codex (and the ChatGPT desktop app, where it supports local MCP servers) reads ~/.codex/config.toml. Add a [mcp_servers.betternotez] entry to ~/.codex/config.toml (Windows: %USERPROFILE%\\.codex\\config.toml, or under CODEX_HOME if that is set), keeping everything already there. If the codex command is available, \`codex mcp add betternotez -- node "<file>"\` does the same. If you are the ChatGPT desktop app and it doesn't read that file, add the server through its own settings for MCP servers or connectors instead.`,
)

const ASK = 'ask “List my BetterNotez subjects.”'

export const APPS = {
  claude: {
    name: 'Claude',
    icon: 'claude',
    prompt: CLAUDE,
    paste: 'Paste it into Claude Desktop. It walks you through setup.',
    restart: `Quit Claude, open it again, and ${ASK}`,
  },
  'claude-code': {
    name: 'Claude Code',
    icon: 'claude',
    prompt: CLAUDE,
    paste: 'Paste it into Claude Code. It runs the setup.',
    restart: `Start a new session and ${ASK}`,
  },
  chatgpt: {
    name: 'ChatGPT',
    icon: 'openai',
    prompt: CODEX,
    paste: 'Paste it into the ChatGPT desktop app.',
    restart: `Quit ChatGPT, open it again, and ${ASK}`,
  },
  codex: {
    name: 'Codex',
    icon: 'openai',
    prompt: CODEX,
    paste: 'Paste it into Codex. It runs the setup.',
    restart: `Start a new session and ${ASK}`,
  },
}
