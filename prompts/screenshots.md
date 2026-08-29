## Automatically add a site

In the dahboard sidebar another another link called "Auto". When clicked it will load the "Automatically Create a site" section in the main content area. In the main content area there should be an input for the site name, site url, image name and category. The category input should be a dropdown menu from the available categories.

# Functionality

You will use the allscreenshots.com api to get the screenshot of the website. Here are their docs:
Capture your first screenshot
Make a POST request to capture a screenshot:

curl -X POST "https://api.allscreenshots.com/v1/screenshots" \
 -H "X-API-Key: YOUR_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{"url": "https://github.com"}' \
 --output screenshot.png
This saves the screenshot as screenshot.png in your current directory.

The api key is in .env

You will instead have the screenshot name as the image name from the input instead of screenshot.png. Then use the sharp package to scale to image down to web friendly webp. After you have the webp screenshot then automatically create the site. For testing use the following text as the description:

"The website also provides information about government agencies, financial institutions, service providers and business-related requirements in Botswana. It publishes business news, updates and resources covering areas such as regulations, entrepreneurship, financing and market opportunities."

For the tags add these 2 tags: Do Business Botswana, Business Services
