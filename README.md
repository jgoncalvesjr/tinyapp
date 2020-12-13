# TinyApp Project

#### Version: 1.0.1

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

#### Version changes

- Implement basic analytics: Visits, unique visits, created at and visited at timestamps

# Final Product

## Login Page

When you first hit the root address this is the screen you will see the login page. If you do not have a TinyApp account, you may click the Register button to create your TinyApp account.

!["Login page screenshot"](https://github.com/jgoncalvesjr/tinyapp/blob/master/docs/login.png?raw=true)

## Welcome Page

If you are not logged to TinyApp and click the "My URLs" or "Create New URL" links at the top of your navbar, you will be redirected to TinyApp's welcome page, with login and registration guidelines.

!["Welcome page screenshot"](https://github.com/jgoncalvesjr/tinyapp/blob/master/docs/home.png?raw=true)

## Index Page

Once logged in, you'll be redirected to the list of your shortened URLs, and their corresponding original URLs. You may click the **Update** button to update any of your created links to a new web address, or **Delete** to delete your TinyURL.

!["Index page screenshot"](https://github.com/jgoncalvesjr/tinyapp/blob/master/docs/index.png?raw=true)

## Create a TinyURL
Creating a TinyURL is straightforward. All you have to do is insert the full address of the webpage - which cannot be empty - and then click **Submit** to create your new Short URL. After that, you will be redirected to a page with your new Short URL, its corresponding Long URL, and an option to update its address. 

You can share your TinyURL with anyone, so they may access the webpage without having to write down huge texts!

!["New page screenshot"](https://github.com/jgoncalvesjr/tinyapp/blob/master/docs/new.png?raw=true)

## Update your TinyURL
The Update page is very similar to the Create page. It will show your current TinyURL for the Long URL, which you can update anytime as you wish - again, the web address cannot be empty. Just place the new address and click **Update** to provide the address update. You will be redirected to the Index page after updating the address.

Only **you** may update any TinyURL you may have created. If anyone else tries to access the update page for your TinyURL, they will be redirected to the welcome page.

!["Update page screenshot"](https://github.com/jgoncalvesjr/tinyapp/blob/master/docs/show-update.png?raw=true)

# Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override
- Morgan
- MomentJS

# Getting Started

- Fork this repository, then `git clone` to clone repository into your local machine.
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command. 
- If you do not wish to use Morgan for server monitoring, you may run the development server using the `node express_server.js` command instead.

