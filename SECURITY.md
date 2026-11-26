# Security policy

## Report a vulnerability

Please report it privately, not in a public issue, and don't paste real secrets anywhere.

Use GitHub's private vulnerability reporting: go to the repository's **Security** tab and choose **Report a vulnerability** (https://github.com/ultraman-app/ultraman-app.github.io/security/advisories/new). Only you and the maintainers see the report.

Say which version you used (**?** › **About Ultraman** in the window, or `ultraman --version`), your operating system and what you saw. Steps that reproduce it help most. Please don't include real secrets or someone else's data: a made-up value is enough.

## What is in scope

- The desktop app (the window and its updater).
- The CLI and `serve`, the local server the window and the CLI talk to.
- The MCP bridge (`ultraman mcp`).
- The installer scripts and the installers on the site.
- The CI action, `ultraman-app/run-action`.

The things we most want to hear about are the promises in the security page of the documentation: a secret going anywhere but a host you approved, or showing up in a result, history or export; something being sent without your yes; a file outside your project being read; another website or program driving the local server.

Out of scope: problems that need an attacker who already controls your computer or your account, and findings in the systems you test with Ultraman.

## What to expect

- We acknowledge your report within **72 hours**.
- We tell you whether we can reproduce it and keep you posted until it is fixed.
- We credit you in the release notes if you want that.
- There is no bug bounty.

Please give us a reasonable time to fix it before you share details publicly.

## How fixes ship

A fix goes out in a new release. The app says when there is one and installs the signed update when you choose **Update and restart**; an `ultraman` command the install script put in place is refreshed with it. The release notes say a security fix was made, without the details that would help an attack. If you run the CLI on its own, update it with the installer.

## Check the release key

The install scripts install only a release whose `SHA256SUMS` carries a valid signature from Ultraman's release key.
The key's public half is inside `install.sh` and `install.ps1`. Its SHA-256 fingerprint is:

```
d3:e8:ce:35:a9:38:99:f4:1e:89:44:95:6e:f0:91:06:db:25:d8:4d:92:1d:a1:b6:25:f2:54:05:76:70:75:df
```

To compare it with the copy in the script you downloaded (macOS and Linux, with OpenSSL):

```sh
sed -n '/BEGIN PUBLIC KEY/,/END PUBLIC KEY/p' install.sh | openssl pkey -pubin -outform DER | openssl dgst -sha256 -c
```

`install.ps1` carries the same key in .NET's XML form; the command reads `install.sh`, which you can download beside it.
This file and the install page are two copies of the same value, so they let you notice a script that was changed;
neither proves the other.

## Supported versions

Only the latest release gets fixes.
