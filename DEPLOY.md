# Deploying aexon.uk on the WHM / cPanel VPS

This guide is for the server you already run: WHM with root access, one cPanel
package per site, each site a Next.js app under PM2, and email handled by cPanel.
The domain was bought from Cloudflare, so **Cloudflare is the DNS** for aexon.uk.

> **Why WHM's Zone Editor does nothing for aexon.uk.** Domains registered with
> Cloudflare must keep Cloudflare's nameservers. WHM still creates a local zone for
> the account, but nobody on the internet reads it. Every DNS record below goes in
> **Cloudflare > aexon.uk > DNS > Records**. Leave the WHM zone alone.

> **Do not install Nginx.** cPanel's Apache owns ports 80 and 443 for all your sites.
> Apache forwards aexon.uk to the app instead (step 6). `deploy/nginx-aexon.conf`
> is from an older plain-Ubuntu setup and is not used on this server.

Work through the steps in order. Steps 1–4 can be done today; DNS changes usually
show up within minutes on Cloudflare.

---

## Quick start for this server (144.79.249.12)

### A. Fix the Cloudflare DNS (from the 9 Nov 2026 zone export)

Your zone already has the website, MX, SPF, DKIM and DMARC records. Three changes:

| Action | Type | Name | Content | Proxy |
|---|---|---|---|---|
| **Add** | A | `mail` | `144.79.249.12` | **DNS only** |
| **Delete** | PTR | `12.249.79.144.in-addr.arpa` | – | – |
| Add (optional) | A | `webmail`, `autodiscover`, `autoconfig` | `144.79.249.12` | DNS only |

- **The `mail` record is essential.** The MX record points to `mail.aexon.uk`, but
  that name doesn't exist yet, so no email for @aexon.uk can be delivered.
- **The PTR record does nothing** inside a Cloudflare zone. Reverse DNS is set at
  your VPS provider, where it already says `server.aexonhealthcare.com`.
- Check that the DKIM value in Cloudflare matches cPanel > Email Deliverability for
  aexon.uk exactly.
- Cloudflare > **SSL/TLS** must be on **Full (strict)**, not Flexible (step 7).

### B. Deploy from GitHub in WHM > Terminal (everything as root)

The code is at `https://github.com/firefish46/Aexon-web` (public, branch `main`).
Every command below runs as root; there is no need to switch to the cPanel user.

- **Where the files live:** in the aexon.uk account's home folder, owned by that
  account.
- **Git ownership:** root is told the folder is a safe repository, so Git doesn't
  refuse with "dubious ownership".
- **Who runs the site:** PM2 runs under root, but `ecosystem.config.cjs` starts the
  website itself as the folder's owner, not as root. A problem in the site then
  stays inside the aexon.uk account and can't reach your other sites.

```bash
# 1. The cPanel account that owns aexon.uk, and where the site will live
U=$(/scripts/whoowns aexon.uk); APP=/home/$U/aexon-web; echo "user: $U  folder: $APP"

# 2. Check Node (needs 20.9 or newer), Git and PM2, and that port 3100 is free
node -v; git --version; pm2 -v
ss -ltnp | grep ':3100 ' || echo "port 3100 is free"

# 3. Get the code, and mark it as a safe repository for root
git clone https://github.com/firefish46/Aexon-web.git "$APP"
git config --global --add safe.directory "$APP"

# 4. Quote form email settings
cd "$APP"
cp .env.example .env.production
nano .env.production        # put in the website@aexon.uk mailbox password, then Ctrl+O, Enter, Ctrl+X

# 5. Install and build
npm ci
npm run build

# 6. Hand the folder to the cPanel account (the app runs as it), and protect the password file
chown -R "$U:$U" "$APP"
chmod 600 "$APP/.env.production"

# 7. Start with PM2; it runs the site as $U
pm2 start ecosystem.config.cjs
pm2 save
ps -o user= -p "$(pm2 pid aexon-web)"       # should print the cPanel user, not root
curl -sI http://127.0.0.1:3100 | head -1    # expect: HTTP/1.1 200 OK

# 8. Send aexon.uk traffic from Apache to the app
for t in ssl std; do
  mkdir -p /etc/apache2/conf.d/userdata/$t/2_4/$U/aexon.uk
  cp "$APP/deploy/apache-aexon-proxy.conf" /etc/apache2/conf.d/userdata/$t/2_4/$U/aexon.uk/aexon-proxy.conf
done
/scripts/ensure_vhost_includes --user=$U
/scripts/rebuildhttpdconf && /scripts/restartsrv_httpd

# 9. Test, bypassing Cloudflare
curl -skI --resolve aexon.uk:443:144.79.249.12 https://aexon.uk | head -3
```

**Notes:**

- **If `node -v` is older than 20.9 or missing:** use the Node your other sites use,
  for example `export PATH=/opt/cpanel/ea-nodejs22/bin:$PATH`.
- **If `pm2 -v` fails:** run `npm install -g pm2`.
- **If port 3100 is taken:** pick another and change it in `ecosystem.config.cjs` and
  `deploy/apache-aexon-proxy.conf`.
- **After a reboot:** root's PM2 is probably already set to start on boot for your
  other sites. If `pm2 startup` has never been run as root, run it once.

Then finish in cPanel and Cloudflare:

- Create the `website@aexon.uk` mailbox and set **Email Routing** to Local (steps 2–3).
- Run **AutoSSL** (step 4). If it fails for `aexon.uk` or `www`, switch those two
  Cloudflare records to DNS only, run it again, then switch them back to Proxied.
- Apply the Cloudflare settings in step 7.

### C. Update the site later (root Terminal)

```bash
cd /home/$(/scripts/whoowns aexon.uk)/aexon-web && ./deploy/update.sh
```

The script pulls from GitHub, installs, builds, hands the files back to the cPanel
account, and reloads the app.

The sections below explain each step in more detail.

---

## What you need first

| Item | Where to find it | Written below as |
|---|---|---|
| Server IPv4 address | WHM home page, or your VPS provider | `SERVER_IP` |
| Server IPv6 address, if it has one | same | `SERVER_IPV6` |
| cPanel username of the aexon.uk package | WHM > List Accounts | `CPANELUSER` |
| A free local port for the app | step 5 | `3100` |

---

## 1. Cloudflare DNS

Cloudflare > aexon.uk > **DNS > Records**. First delete any records Cloudflare added
on purchase (parking A records, a default MX). Then add these.

Start with **every record set to "DNS only" (grey cloud)**. You switch the website
records to "Proxied" in step 7, after the server has its SSL certificate.

| Type | Name | Content | Proxy | Notes |
|---|---|---|---|---|
| A | `@` | `SERVER_IP` | DNS only (later Proxied) | the website |
| CNAME | `www` | `aexon.uk` | DNS only (later Proxied) | |
| A | `mail` | `SERVER_IP` | **DNS only, always** | email can't pass through Cloudflare's proxy |
| MX | `@` | `mail.aexon.uk` | – | priority `10` |
| TXT | `@` | SPF, copied from cPanel in step 3 | – | |
| TXT | `default._domainkey` | DKIM, copied from cPanel in step 3 | – | |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@aexon.uk` | – | tighten to `p=quarantine` after a few weeks of good reports |
| A | `webmail` | `SERVER_IP` | DNS only | optional: webmail.aexon.uk |
| A | `autodiscover`, `autoconfig` | `SERVER_IP` | DNS only | optional: lets Outlook and phones set up mail automatically |
| AAAA | `@`, `mail` | `SERVER_IPV6` | same as the A records | only if the server has IPv6 |

Check from any computer (results can take a few minutes):

```bash
nslookup aexon.uk 1.1.1.1
nslookup -type=mx aexon.uk 1.1.1.1
```

---

## 2. WHM / cPanel account checks

**In WHM, as root:**

1. **List Accounts:** confirm the package's primary domain is `aexon.uk`.
2. **Manage Shell Access:** set `CPANELUSER` to **Normal Shell**, so you can run
   Node and PM2 as that user. If your other sites run PM2 as root instead, keep
   doing it the same way they do. The steps are identical apart from the user.
3. **Node.js version:** run `node -v` as that user. Next.js 16 needs **20.9 or newer**.
   If it is older, install Node 22 the same way your other sites got theirs. On
   cPanel that is often EasyApache 4's `ea-nodejs22` package, at
   `/opt/cpanel/ea-nodejs22/bin`.
4. **Apache proxy modules:** run `httpd -M | grep -E "proxy_module|proxy_http|headers"`.
   You need `proxy_module`, `proxy_http_module` and `headers_module`. Your other
   Next.js sites almost certainly use them already. If not: WHM > EasyApache 4 >
   Customize > Apache Modules > enable `mod_proxy`, `mod_proxy_http` and `mod_headers`.

**In cPanel for `CPANELUSER`:**

5. **Email Routing** (under Email): choose **Local Mail Exchanger**. cPanel can't see
   Cloudflare's DNS, so it may guess "Remote" and send aexon.uk mail away from the
   server. This step matters.

---

## 3. Email accounts and deliverability

cPanel > **Email Accounts**, create:

- `website@aexon.uk`: the website sends quote requests from this mailbox.
- Any real mailboxes you want, for example `sales@aexon.uk` or `postmaster@aexon.uk`
  (the latter receives the DMARC reports).

cPanel > **Email Deliverability** > aexon.uk > **Manage**:

- Copy the suggested **SPF** value (it looks like `v=spf1 +a +mx +ip4:SERVER_IP ~all`)
  into the Cloudflare TXT record for `@`.
- Copy the **DKIM** value into the Cloudflare TXT record named `default._domainkey`.
  It is long; paste it as one value and Cloudflare will split it as needed.
- Wait a few minutes and reload the page. It should show both as **Valid**. cPanel
  may still warn that "the server is not authoritative". That is expected with
  Cloudflare DNS and can be ignored.

**Reverse DNS (PTR).** This is set once for the whole server at your VPS provider,
usually to the server's hostname. It is shared with your other sites, so leave it
as it is if their mail already delivers well.

---

## 4. SSL certificate on the server

With the records still on DNS only, in WHM > **Manage AutoSSL** > **Manage Users**,
run AutoSSL for `CPANELUSER`. Then check cPanel > **SSL/TLS Status**: `aexon.uk`,
`www.aexon.uk` and `mail.aexon.uk` should all show a valid certificate.

The website certificate lets Cloudflare connect to the server securely. The mail
certificate is what phones and Outlook see, and what the app checks when it sends
quote emails.

---

## 5. Put the app on the server

### 5a. Choose a port

Each Next.js site on the server needs its own port. As root, list the ones in use:

```bash
ss -ltnp | grep 127.0.0.1
```

Pick a free one; this guide uses **3100**. If you choose a different port, change it
in `ecosystem.config.cjs` and `deploy/apache-aexon-proxy.conf`.

### 5b. Upload the code

The app lives **outside** `public_html`, in `/home/CPANELUSER/aexon-web`.

**If the project is in a Git repository** (recommended), as `CPANELUSER`:

```bash
cd ~
git clone <your repo URL> aexon-web
```

**Otherwise, upload a zip.** On your Windows PC, in PowerShell:

```powershell
cd C:\VSCODE
tar -czf aexon-web.tar.gz --exclude=node_modules --exclude=.next --exclude=".env" --exclude=".env.production" --exclude="Laser Pro Printer_*" aexon-web
```

Upload `aexon-web.tar.gz` to `/home/CPANELUSER/` with cPanel **File Manager**. Then,
in a shell as `CPANELUSER`:

```bash
cd ~ && tar -xzf aexon-web.tar.gz && rm aexon-web.tar.gz
```

### 5c. Settings for the quote form

```bash
cd ~/aexon-web
cp .env.example .env.production
nano .env.production
```

Fill in the password of `website@aexon.uk`. The other values are already right
for this server:

- **Host:** the app sends through `127.0.0.1`, the mail server on the same machine.
  That keeps it clear of WHM's "SMTP Restrictions", which block apps from connecting
  out to mail servers.
- **Certificate:** it is still checked against `mail.aexon.uk`.
- **Recipient:** requests go to `QUOTE_TO` (cmo@dmebd.com), and the visitor's
  address is set as reply-to.

Then `chmod 600 .env.production` so only this user can read the password.

### 5d. Build and start

```bash
cd ~/aexon-web
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup     # prints one command: run that command as root, so the app starts after a reboot
```

Check it from the server itself:

```bash
curl -I http://127.0.0.1:3100
```

You should see `HTTP/1.1 200 OK`. If the build stops with an out-of-memory error,
run it as `NODE_OPTIONS=--max-old-space-size=2048 npm run build`.

---

## 6. Point Apache at the app

cPanel regenerates Apache's config, so the proxy goes in cPanel's include folders.
As root, replacing `CPANELUSER`:

```bash
U=CPANELUSER
for t in ssl std; do
  mkdir -p /etc/apache2/conf.d/userdata/$t/2_4/$U/aexon.uk
  cp /home/$U/aexon-web/deploy/apache-aexon-proxy.conf /etc/apache2/conf.d/userdata/$t/2_4/$U/aexon.uk/aexon-proxy.conf
done
/scripts/ensure_vhost_includes --user=$U
/scripts/rebuildhttpdconf && /scripts/restartsrv_httpd
```

Test from the server, bypassing Cloudflare:

```bash
curl -I --resolve aexon.uk:443:SERVER_IP https://aexon.uk
```

It should answer `200` with `x-powered-by: Next.js`.

---

## 7. Turn on Cloudflare

In Cloudflare > aexon.uk:

1. **DNS > Records:** switch `@` and `www` to **Proxied** (orange cloud). Leave `mail`,
   `webmail`, `autodiscover` and `autoconfig` on DNS only.
2. **SSL/TLS > Overview:** set the encryption mode to **Full (strict)**. Never use
   "Flexible": with Flexible, Cloudflare talks to your server over plain HTTP.
3. **SSL/TLS > Edge Certificates:** turn on **Always Use HTTPS**.
4. **Speed > Optimization:** make sure **Rocket Loader** is **off**. It rewrites
   scripts and can break the 3D viewer and the slider.

Leave caching on its defaults. Cloudflare caches the `/_next/static` files, and the
app already marks them as safe to cache for a year.

---

## 8. Final checks

| Check | How |
|---|---|
| Site loads over HTTPS | open https://aexon.uk and https://www.aexon.uk |
| 3D model and slider work | Laser Pro page and home page |
| Quote form delivers | submit it, then check the inbox at cmo@dmebd.com. Errors appear in `pm2 logs aexon-web` |
| Mail is trusted | send a mail from webmail to the address shown at https://www.mail-tester.com, aiming for 9/10 or better |
| Mail reaches you | send a mail from Gmail to `sales@aexon.uk` and read it in webmail |

---

## Updating the site later

As `CPANELUSER`:

```bash
cd ~/aexon-web
./deploy/update.sh      # with Git: pulls, installs, builds, reloads
```

Without Git: upload the new code as in step 5b. It won't overwrite `.env.production`,
because the zip leaves it out. Then run `npm ci && npm run build && pm2 reload aexon-web`.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Cloudflare error 521 | the app is not running (`pm2 status`), or Apache isn't proxying it (step 6) |
| Cloudflare error 526 | SSL mode is Full (strict) but the server certificate is missing; rerun AutoSSL (step 4) |
| Redirect loop | SSL mode set to Flexible; use Full (strict) |
| Another site shows up at aexon.uk | the proxy include is in the wrong folder, or `rebuildhttpdconf` wasn't run |
| Form says "could not deliver" | wrong mailbox password in `.env.production`, or the mail certificate doesn't cover `mail.aexon.uk` yet |
| Mail to @aexon.uk never arrives | Email Routing isn't set to Local (step 2), or the MX record is missing |
| Sent mail lands in spam | SPF or DKIM isn't Valid in Email Deliverability (step 3) |

| Task | Command (as `CPANELUSER`) |
|---|---|
| Logs, including quote delivery errors | `pm2 logs aexon-web` |
| Restart | `pm2 restart aexon-web` |
| Status | `pm2 status` |
