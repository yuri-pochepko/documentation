---
title: Drupal Commerce on Drupal 8 Without Continuous Integration
description: Use Composer to Install Drupal Commerce with Drupal 8, on Pantheon
contributors: [alexfornuto, stevector]
tags: [drupal, siteintegrations]
type: guide
permalink: docs/guides/:basename/
---

This guide covers installing [Drupal Commerce](https://drupalcommerce.org/){.external}, an e-commerce implementation designed specifically for Drupal. At the end of this guide you will have a Drupal Commerce site managed via composer.


## Before You Begin

This process uses Composer to manage modules and dependencies. Before proceeding, you may wish to consult the following docs:

 - [Composer Fundamentals and Workflows](/docs/composer)


1.  This guide uses several variables in example [Terminus](/docs/terminus) commands. This lets you copy and paste without needing to change the variable. For this to work, you must first export the variables in your local terminal session:

    ```bash
    export $PANTHEON_SITE_NAME=yoursitenamehere
    ```

    - `PANTHEON_SITE_NAME` will be used as the machine names of the Pantheon site and the GitHub repo created in this process

## Create a New Drupal 8 Site

To begin, we’ll want to start a brand new Drupal 8 site on Pantheon from our empty upstream. This upstream is different from the Drupal 8 upstream in that it does not come with any Drupal files. As such, you must use Composer to download Drupal.

Before we begin choose a machine-friendly site name. It should be all lower case with dashes instead of spaces. I'll use d8-commerce-no-ci but choose your own. Once you have a site name export it to a variable for re-use.

You should also be authenticated with Terminus. See the Authenticate into Terminus section of the machine tokens documentation for details.

Create a new Pantheon site with an empty upstream.

    ```bash
    terminus site:create $PANTHEON_SITE_NAME 'My D8 Commerce Site No CI' empty
    ```

Note you can also add the --org argument to terminus site:create if you would like the site to be part of an organization. See terminus site:create -h for details and help.


## Install Drupal Commerce

1. Move into the local repository for your site:

        cd $SITENAME

2. Use Composer to install the [Commerce Installation Profile](https://github.com/drupalcommerce/commerce_base){.external}:

   ```bash
   composer config repositories.commerce_base vcs https://github.com/drupalcommerce/commerce_base
   composer require "drupalcommerce/commerce_base dev-8.x-1.x"
   ```

3. Running `git status` should show that the `composer.json` and `composer.lock` files have changed:

   ![Git Status showing updated Composer files](/source/docs/assets/images/guides/drupal-8-commerce/git-status.png)

4. Commit the new files and push them to GitHub:

   ```bash
   git commit -am "add commerce_base to project"
   git push origin master
   ```

5. From your [CircleCI Dashboard](https://circleci.com/dashboard){.external} you can see that tests are already being run on your new commit. Once they pass, CircleCI will push the changes to your Site Dashboard.

6. Go to your newly created Site Dashboard. Under the <span class="glyphicons glyphicons-wrench"></span> **Dev** tab, click on <span class="glyphicons glyphicons-embed-close"></span> **Code**, then **install later**. You should now see your commit history. Once CircleCI completes the automated tests built into our repository, it will commit the build assets and push them to Dev:

    ![Build Assets on Dev](/source/docs/assets/images/guides/drupal-8-commerce/build-assets.png)

## Reinstall Drupal

1. The Build Tools Plugin command we used earlier automatically installed Drupal's standard profile in the Dev environment for us. Now that we've installed the Commerce profile, we want that installed instead. Using Terminus, we can run the Drush command `site-install` which will first clear the database of the Standard profile before installing Commerce. This Drush command requires that the system be in writable (SFTP) mode:

   ```bash
   terminus connection:set $SITENAME.dev sftp
   terminus drush $SITENAME.dev -- site-install commerce
   ```

   Review the last two lines of output to identify the username and password created:

   ```bash
   Installation complete.  User name: admin  User password: jTHD8hd85U         [ok]
   Congratulations, you installed Drupal!                                  [status]
   ```


2. Log in to your Drupal site in the Dev environment. The presence of the **Commerce** button on the toolbar indicates a succefull install:

    ![Drupal Commerce in the Toolbar](/source/docs/assets/images/guides/drupal-8-commerce/commerce-button.png)

## Conclusion

What you do next is up to you and your needs. Remember that you're now using Composer to manage core, modules, and dependencies for your site. Consider reading our [Composer Fundamentals and Workflows](/docs/composer) doc for more information.

##See Also

 - [Drupal Commerce](https://drupalcommerce.org/)
