# Cloudflare + GitHub Pages Setup Guide

Complete guide for configuring your custom domain (vibemd.app) with Cloudflare DNS and GitHub Pages with HTTPS.

## Overview

You have:
- ✅ Domain: `vibemd.app`
- ✅ Nameservers: Cloudflare
- ✅ GitHub Pages site ready
- ❌ Need: DNS configuration and HTTPS enforcement

---

## Step 1: Configure Cloudflare DNS

### Login to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Select your domain: `vibemd.app`
3. Click **DNS** in the left sidebar

### Add DNS Records

You need to configure DNS for both the apex domain (`vibemd.app`) and the www subdomain (`www.vibemd.app`).

#### Option A: Use www.vibemd.app (Recommended)

**Add CNAME record for www:**
```
Type: CNAME
Name: www
Target: vibemd.github.io
Proxy status: DNS only (grey cloud) ⚠️ IMPORTANT
TTL: Auto
```

**Add redirect from apex to www:**
```
Type: CNAME
Name: @ (or vibemd.app)
Target: vibemd.github.io
Proxy status: DNS only (grey cloud) ⚠️ IMPORTANT
TTL: Auto
```

#### Option B: Use apex domain vibemd.app only

**Add CNAME record (using CNAME flattening):**
```
Type: CNAME
Name: @ (or vibemd.app)
Target: vibemd.github.io
Proxy status: DNS only (grey cloud) ⚠️ IMPORTANT
TTL: Auto
```

### ⚠️ CRITICAL: Proxy Status Must Be "DNS only"

**The cloud icon MUST BE GREY (not orange)!**

Why:
- GitHub Pages generates SSL certificates
- Cloudflare Proxy (orange cloud) interferes with GitHub's SSL validation
- Keep it "DNS only" (grey cloud) during initial setup
- You can enable proxy AFTER HTTPS is working

**To set DNS only:**
- Click the **orange cloud** icon to toggle to **grey cloud**
- Grey cloud = DNS only (no Cloudflare proxy)

---

## Step 2: Add CNAME File to Your Repository

GitHub Pages needs a CNAME file to know which custom domain to use.

### Create the CNAME file

The CNAME file should contain your domain (without https://):

**If using www.vibemd.app:**
```
www.vibemd.app
```

**If using apex vibemd.app:**
```
vibemd.app
```

I'll create this file for you in the next step.

---

## Step 3: Configure GitHub Pages Settings

### Enable Custom Domain

1. Go to https://github.com/vibemd/VibeMD/settings/pages

2. Under **Custom domain**, enter:
   - `www.vibemd.app` (if using www), OR
   - `vibemd.app` (if using apex)

3. Click **Save**

4. Wait for DNS check (should show green checkmark within a few minutes)

### What GitHub Does

- Checks DNS records
- Generates SSL certificate (can take up to 24 hours, usually 5-10 minutes)
- Once certificate is ready, "Enforce HTTPS" checkbox appears

---

## Step 4: Wait for DNS Propagation

### Check DNS Propagation

Use these tools to verify DNS is working:

**Check CNAME:**
```bash
# In terminal:
dig www.vibemd.app CNAME +short
# Should return: vibemd.github.io
```

Or use online tool: https://www.whatsmydns.net/

**Expected Results:**
- `www.vibemd.app` → `vibemd.github.io`
- All locations should show the same result

### Typical Timeline

- **DNS propagation**: 5 minutes to 24 hours (usually < 30 minutes with Cloudflare)
- **GitHub certificate generation**: 5 minutes to 24 hours (usually < 1 hour)

---

## Step 5: Enable HTTPS

### Once DNS is Verified

1. Go back to https://github.com/vibemd/VibeMD/settings/pages

2. Wait for the green checkmark next to your domain

3. GitHub will automatically provision an SSL certificate

4. Once ready, check **Enforce HTTPS**

5. Click **Save**

### If "Enforce HTTPS" is Greyed Out

This means GitHub is still provisioning the certificate. Wait and check:

**Reasons:**
- DNS records not propagated yet
- Cloudflare proxy is enabled (must be grey cloud)
- GitHub is still generating certificate
- CNAME file missing or incorrect

**Solutions:**
1. Verify Cloudflare DNS is set to "DNS only" (grey cloud)
2. Wait 10-30 minutes
3. Check DNS with `dig www.vibemd.app` or online tools
4. Verify CNAME file exists in your repository

---

## Step 6: Optional - Re-enable Cloudflare Proxy

**AFTER HTTPS is working**, you can optionally re-enable Cloudflare proxy for:
- DDoS protection
- CDN caching
- Analytics

### To Enable Cloudflare Proxy

1. Wait until GitHub Pages HTTPS is fully working
2. Go to Cloudflare DNS settings
3. Click the **grey cloud** to make it **orange** (Proxied)
4. Cloudflare will now proxy your traffic

### Cloudflare SSL Settings

If using Cloudflare proxy, configure SSL:

1. Go to **SSL/TLS** in Cloudflare
2. Set encryption mode to: **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

---

## Troubleshooting

### DNS Check Fails on GitHub

**Error: "DNS check unsuccessful"**

**Solutions:**
1. Verify DNS records in Cloudflare are correct
2. Ensure cloud is GREY (DNS only), not orange
3. Wait 5-10 more minutes
4. Clear GitHub's cache by removing and re-adding the domain

### HTTPS Won't Enable

**Error: "Enforce HTTPS" checkbox disabled**

**Solutions:**
1. Cloudflare proxy must be OFF (grey cloud)
2. Wait up to 24 hours for certificate generation
3. Remove domain, wait 5 minutes, add it back
4. Check browser at https://www.vibemd.app - might already be working!

### Certificate Errors

**Error: "Certificate mismatch" or "Not secure"**

**Solutions:**
1. Wait - certificate can take up to 24 hours
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
3. Check in incognito/private window
4. Verify DNS propagation is complete

### Site Shows 404

**Error: 404 page not found**

**Solutions:**
1. Verify CNAME file exists in repository
2. Check GitHub Actions deployment succeeded
3. Wait a few minutes for deployment
4. Try accessing direct URL: https://vibemd.github.io/VibeMD/

---

## Quick Reference: DNS Settings

### Recommended Configuration (www subdomain)

**Cloudflare DNS Records:**
```
Type: CNAME
Name: www
Content: vibemd.github.io
Proxy: DNS only (grey cloud)
TTL: Auto

Type: CNAME (or A records)
Name: @
Content: vibemd.github.io
Proxy: DNS only (grey cloud)
TTL: Auto
```

**CNAME file (in site/ folder):**
```
www.vibemd.app
```

**GitHub Pages Custom Domain:**
```
www.vibemd.app
```

---

## Verification Checklist

Before enabling HTTPS, verify:

- [ ] Cloudflare DNS records created
- [ ] Cloud icon is GREY (DNS only), not orange
- [ ] CNAME file exists in repository (site/CNAME)
- [ ] DNS propagation complete (check with dig or whatsmydns.net)
- [ ] GitHub Pages shows green checkmark next to domain
- [ ] Wait 10-30 minutes for SSL certificate
- [ ] "Enforce HTTPS" checkbox becomes available
- [ ] Enable HTTPS and save

---

## Expected Timeline

1. **Configure DNS**: 5 minutes
2. **DNS propagation**: 5-30 minutes
3. **SSL certificate**: 10 minutes - 24 hours (usually < 1 hour)
4. **Site live with HTTPS**: Total 30 minutes - 24 hours

---

## Final URLs

Once configured, your site will be accessible at:

- **Primary**: https://www.vibemd.app (or https://vibemd.app)
- **Fallback**: https://vibemd.github.io/VibeMD/

Both URLs will work, but the custom domain is primary.

---

## Need Help?

- Cloudflare DNS Docs: https://developers.cloudflare.com/dns/
- GitHub Pages Custom Domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- Let's Encrypt Status: https://letsencrypt.status.io/ (GitHub uses Let's Encrypt)

---

**Next Steps:**
1. Configure Cloudflare DNS (set to grey cloud)
2. I'll create the CNAME file for you
3. Configure custom domain in GitHub Pages settings
4. Wait for DNS + SSL
5. Enable HTTPS
