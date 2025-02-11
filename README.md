# Getting Started with Ibrahim Space Studio's Custom React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and customized for efficient development and deployment.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder with optimized performance and no source map generation, set by:

```json
"build": "cross-env GENERATE_SOURCEMAP=false react-scripts build"
```

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run clean`

Removes the `build` directory after copying its content to a `backup` directory.\
This can be useful for maintaining a history of previous builds. The command sequence is:

```json
"clean": "npm run backup && rimraf build"
```

### `npm run backup`

Deletes the previous `backup` directory and then runs the backup script, creating a fresh backup of the current `build` output.\
This step is handled by:

```json
"backup": "rimraf backup && node src/libs/scripts/backup.js"
```

### `npm run restore`

Restores the latest backup to the `build` directory.\
This script is useful for reverting to a previous build. To restore, run:

```json
"restore": "node src/libs/scripts/restore.js"
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## SEO Optimization with `SEO` Component

To simplify SEO metadata management, use the `SEO` component (using react-helmet-async) on each page.

```js
import SEO from "../libs/plugins/seo";
```

This component accepts several props for SEO customization:

- `title`: Page title
- `description`: Meta description for the page
- `route`: Canonical route for the page
- `type`: Type of content (e.g., article, website)
- `imageSrc`: URL for the image used in social previews
- `imageWidth`: Width of the image (default is "920")
- `imageHeight`: Height of the image (default is "470")
- `imageAlt`: Alt text for the image
- `canonical`: Canonical URL for the page
- `isNoIndex`: Set to true to add `<meta name="robots" content="noindex, nofollow" />` and prevent search engines from indexing the page.

Example usage:

```jsx
<>
  <SEO title="This is product page's title" description="This is product page's description" route="/product" />
  <Pages>{/* page content rendered here */}</Pages>
</>
```

## Routing Setup

The app is wrapped in `<BrowserRouter>` and uses `<Routes>` and `<Route>` components to define page routes. This makes adding new pages and routes straightforward.

## IbrahimStudioProvider for Extended Functionality

The `<App />` component is wrapped with `<IbrahimStudioProvider>`, providing additional features for the app. For details on these features, refer to the [@ibrahimstudio/react's README](https://github.com/space-ibrahimstudio/ibrahimstudio/tree/main/packages/react/react).

## Web Vitals Reporting

Web Vitals are enabled to measure performance. In development mode, reports are sent to the browser console. In production, the reports are sent to Google Analytics.\
To use this feature, ensure you:

1. Set `REACT_APP_GTAG` in your `.env` file with your GA Measurement ID.
2. Uncomment the Google Analytics initialization script in `public/index.html`.

## Environment Variables

For everything to work correctly, the following environment variables need to be set:

```env
REACT_APP_AUTHOR
REACT_APP_GTAG
REACT_APP_SITENAME
REACT_APP_DOMAIN
REACT_APP_LOCALE
REACT_APP_THEME
```

These variables allow you to define the site name, domain, locale, theme color, and other settings as needed.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
