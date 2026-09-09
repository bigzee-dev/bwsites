## Impleemt The "Images" functionality in the admin area

I am solving a problem whereby i am starting to have lots of images in my cloudflare bucket and unfortunately I cannot use the images name to search for it in Cloudflare. So if i am looking for specific image it is taking me a long time in cloudflare, so lets get the images from cloudflare and make them searchable in the admin area

# left sidebar

in the left sidebar add an "Images" nav link, when clicked it will load all the projects images stored in a cloudflare r2 bucket

# main content area

You will fetch and display the images in the main content area. i want to be able to search an image so have a serach bar on top of the list of images. Each "Image" should have a small photo of the image its file size and the option to download it, NO edit, No delete. Implement pagination, each page shpould have 50 images, page1 (1-49), page2 (50-59) e.t.c
