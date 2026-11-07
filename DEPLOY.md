# Deploying to your VPS

These steps assume an Ubuntu 22.04 or 24.04 server with root or sudo access. The site runs as a Node.js process managed by PM2, with Nginx in front for HTTPS.

## 1. One time server setup

```bash
# Node.js 22 and build tools
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# PM2 process manager
sudo npm install -g pm2
```

## 2. Point the domain at the server

At your domain registrar, set DNS **A records** for `aexon.uk` and `www.aexon.uk` to your VPS IP address. Wait until `ping aexon.uk` shows the new IP.

## 3. Get the code

```bash
sudo mkdir -p /var/www && sudo chown $USER /var/www
cd /var/www
git clone https://github.com/firefish46/aexon-web.git
cd aexon-web
git checkout main   # or the branch you deploy from
```

## 4. Configure email for the quote form

```bash
cp .env.example .env.production
nano .env.production
```

Fill in the SMTP details from your email provider. Quote requests are sent to `cmo@dmebd.com`, and the visitor's address is set as reply-to, so you can answer them directly.

If the SMTP settings are missing, the form shows visitors an error with your phone number instead of losing their request.

## 5. Build and start

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # run the command it prints, so the site restarts after a reboot
```

The app now listens on `127.0.0.1:3000`. It is not reachable from outside until Nginx is set up.

## 6. Nginx and HTTPS

```bash
sudo cp deploy/nginx-aexon.conf /etc/nginx/sites-available/aexon
sudo ln -s /etc/nginx/sites-available/aexon /etc/nginx/sites-enabled/aexon
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Free TLS certificate, auto renewing
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d aexon.uk -d www.aexon.uk --redirect
```

If the old site is served by Apache or another Nginx config on the same server, disable it first so the two do not both claim port 80.

## 7. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Updating the site later

```bash
cd /var/www/aexon-web
./deploy/update.sh
```

## Useful commands

| Task | Command |
|---|---|
| See logs, including quote delivery errors | `pm2 logs aexon-web` |
| Restart | `pm2 restart aexon-web` |
| Status | `pm2 status` |
| Test the form email | Submit the form on the live site, then check `pm2 logs` |
