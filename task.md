# ADR Quest Full-Stack Implementation Checklist

- `[x]` Install backend dependencies (`express`, `bcryptjs`, `jsonwebtoken`, `cors`)
- `[x]` Create persistent JSON database manager (`database.js`)
- `[x]` Create Express web server (`server.js`)
- `[x]` Write authentication, modules, lessons, and progress API endpoints in `server.js`
- `[x]` Add admin monitoring and stats API endpoints in `server.js` with role-based checks
- `[x]` Update `index.html` to integrate WhatsApp widget, video chapter elements, and student options
- `[x]` Update `style.css` to style the WhatsApp widget, responsive grids, and new elements
- `[x]` Refactor `script.js` to replace client-side mockup logic with real async `fetch()` API calls
- `[x]` Secure `script.js` view routing (clean out admin container HTML for student roles)
- `[x]` Verify user registration, progress saving, video chapters, WhatsApp link, and admin stats table
