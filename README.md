# E-commerce Demo Projects

All projects are non-commercial and for portfolio.

For install npm modules run

```
npm i
```

If you want to know more about a specific project, scroll ⬇️.

- [useGuitar-api](https://github.com/DorianCzDev/useGuitar-api) is back-end server based on express.js for `useGuitarPanel` with mongoDB database
- [DEMO](https://use-guitar-panel.vercel.app/) [useGuiratPanel](https://github.com/DorianCzDev/useGuitarPanel) is front-end react app for employees where they can add/remove/edit stuff
- [DEMO](https://use-guitar.vercel.app/) [useGuitar](https://github.com/DorianCzDev/useGuitar) is full-stack next.js app where customer can order stuff with mongoDB database
- [DOCS](https://documenter.getpostman.com/view/33345435/2sAXqv4g9Y) [useGuitarApiNest](https://github.com/DorianCzDev/useGuitarApiNest) is back-end server based on NestJS with PostgreSQL database
- [DEMO](https://use-guitar-panel-nest.vercel.app/) [useGuitarPanelNest](https://github.com/DorianCzDev/useGuitarPanelNest) is front-end react app for employees where they can add/remove/edit stuff with NestJS backend

## `useGuitarApiNest` Tech Stack

**Server:** `Typescript`, `Node`, `NestJS`

**Database:** `PostgreSQL`

**Main Libraries:** `TypeORM`, `Cloudinary`, `Nodemailer`, `jsonwebtoken`, `Jest`

## `useGuitarApiNest` Features

- Auth based on cookies - accessToken and refreshToken, the second is stored in database.
- CRUD which in addition to the basic functions allows admin to send/delete image with `cloudinary` API and the same time create/delete it from database
- pagination based on database offset and limit
- real-time calculations by database with pre and post methods
- sending cookies with hashing tokens to client
- middlewares that are responsible for auth, adding headers, error and not found handling
- database migrations
