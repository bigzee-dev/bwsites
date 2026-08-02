## Creating the "Site" model and "Category" Model

This web app will display to users the sites in Botswana that we find usefull. Our team has compiled a list of more than 100 websites in Botswana that are always online, look good, are maintained, offer valuable information, offer good services and are run by competent companies.

A site will be added to our database by the admin using the admin dashboard. Each site will have a name, url, image, description, categories, tags, facebook link(optional). When adding a new site the admin will fill in all this information except the categories. For the categories input the admin will select from a list of categories available and each site can have more than category e.g a Hotel can belong to the "Tourism" and "Hospitalty" categories. The admin will use the admin dashboard to add the categories to the list of available categories.

Create 2 prisma models, 1 model for the site and the other model for the category

## Creating the "Collection" model

Create the Collection model and add it to the schema.prisma. Each Collection will have a name and a list of sites that belong in the collection. A collection can be created while not having any sites but the maximum number of sites in each collection can only be six. A site can be added to multiple collections but 1 site cannot be added more than once to the same collection.
