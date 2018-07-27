# Basics

1. Install dependencies:

```bash
npm install
```

2. Make sure the backend services in ../devops/ are running.

3. Run the app:

```bash
npm start
```

4. Create a release build for deployment:

```bash
npm run build
```

5. If you need to log in:

- uncomment the local API url var in .env.development or create an override (.env.development.local)
- restart the app, so your own API server will get used
- try logging in; this will create an account in the couchdb instance
- log in to couchdb — [see here](../devops/dev/README)
- change the new user's role to "superadmin" in the *accounts* store and save
- log in


To see the detailed *Create React App* documentation go [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

