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

## Get site description and tags from ai model

In the Admin dashboard We will modify the Automatically Create a Site functionality. it currently uses hard coded description and tags. Now lets get the site description and 10 tags from an ai model. Lets use the claude api with sonnet. You will take the site url and pass it into this prompt:

'## Create a description for a website you have visited

Visit this website: https://www.dobusiness.co.bw

I am building a Botswana website directory and need a professional directory description and 10 tags for this website.

Please provide a description:

- The total length of the description should not be more than 1000 characters

- Two small paragraphs

- Exactly 3 sentences per paragraph

- A clear, factual description of what the organisation/business/website does

- Mention the main services, products, or information provided

- Keep the tone professional and suitable for a website directory

- Write for a Botswana audience where relevant

- Do not use marketing hype or exaggerated claims

- Do not mention that you visited the website

- Do not include the website URL in the description

- Do not include bullet points, headings, or extra commentary

The final output should only be the two paragraphs ready to paste into my directory.

Please provide 10 tags that describe the website:

Your output should be json in this form:

{
"description": "string",
"tags" : [an array of strings]
}`

After getting the site description and 10 tags from the ai model use them along with the other information from the Automatically Create a Site to create the site
