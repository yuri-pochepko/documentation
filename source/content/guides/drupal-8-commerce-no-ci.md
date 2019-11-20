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

    export PANTHEON_SITE_NAME=yoursitenamehere

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

## Cloning example-drops-8-composer Locally

Instead of setting up `composer.json` manually, it is easier to start with the [`example-drops-8-composer`](https://github.com/pantheon-systems/example-drops-8-composer){.external} repository.

1. Clone the `example-drops-8-composer` repository locally:

  ```bash
  git clone git@github.com:pantheon-systems/example-drops-8-composer.git $PANTHEON_SITE_NAME
  ```

2. `cd` into the cloned directory:

  ```bash
  cd $PANTHEON_SITE_NAME
  ```

## Updating the Git Remote URL

1. Store the Git URL for the Pantheon site created earlier in a variable:

  ```bash
  export PANTHEON_SITE_GIT_URL="$(terminus connection:info $PANTHEON_SITE_NAME.dev --field=git_url)"
  ```

2. Update the Git remote to use the Pantheon site Git URL returned rather than the `example-drops-8-composer` GitHub URL:

  ```bash
  git remote set-url origin $PANTHEON_SITE_GIT_URL
  ```

## Removing Automation Pieces

`example-drops-8-composer` was designed to run automated tests on a continuous integration server. Unless you plan on running automated tests it is safe to completely remove the automated testing functionality.

1. Delete the following directories:

   * `scripts/github`
   * `scripts/gitlab`
   * `.circleci`
   * `.ci`
   * `tests`
   * `bitbucket-pipelines.yml`
   * `build-providers.json`
   * `.gitlab-ci.yml`

<br>
2. Modify `composer.json`:

   * Remove all dependencies in the `require-dev` section.
   * Update the `scripts` section to remove the `lint`, `code-sniff`, and `unit-test` lines.

3. Remove the following section from `pantheon.yml`:

   ```yml
   workflows:
     sync_code:
       after:
         - type: webphp
           description: Push changes back to GitHub if needed
           script: private/scripts/quicksilver/quicksilver-pushback/push-back-to-github.php
   ```

## Managing Drupal with Composer

<div class="alert alert-info" role="alert">
  <h4 class="info">Note</h4>
  <p markdown="1">When possible, use tagged versions of Composer packages. Untagged versions will include `.git` directories, and the <a href="/docs/git-faq/#does-pantheon-support-git-submodules" data-proofer-ignore> Pantheon platform is not compatible with git submodules</a>. If you remove the `.git` directories, be sure to put them back again after you push your commit up to Pantheon (see instructions below). To do this, remove the vendor directory and run `composer install`.</p>
</div>

### Downloading Drupal Dependencies with Composer

Normally the next step would go through the standard Drupal installation. But since we’re using Composer, none of the core files exist yet. Let’s use Composer to download Drupal core.

1. Since we modified `composer.json` we will need to update Composer. This will also download the defined dependencies:

    ```bash
    composer update
    ```

    This may take a while as all of Drupal core and its dependencies will be downloaded. Subsequent updates should take less time.

    ![image of terminal running a composer install](/source/docs/assets/images/guides/drupal-8-commerce-no-ci/drops-8-composer-update.png)
    
2. And now we need to install:

    ```bash
    composer install
    ```

3. Let's take a look at the changes:

    ```bash
   git status
   ```

   It appears that our web directory isn't being committed. This is because the `example-drops-8-composer` `.gitignore` file assumes that you’re using a build step with continuous integration.

4. To make it compatible with this manual method, you need to edit the `.gitignore` file and remove everything above the `:: cut ::` section:

   **Important:** Without this modification, critical components such as Drupal core and contrib modules will be ignored and not pushed to Pantheon.

5. Now let’s run `git status` again to make sure everything is included:

   ```bash
   git status
   ```

   ![Image of git status showing the changed files in red](/source/docs/assets/images/guides/drupal-8-commerce-no-ci/drops-8-composer-git-status-after-installing-d8.png)

6. Set the site to `git` mode:

   ```bash
   terminus connection:set $PANTHEON_SITE_NAME.dev git
   ```

7. Add and commit the code files. A Git force push is necessary because we are writing over the empty repository on Pantheon with our new history that was started on the local machine. Subsequent pushes after this initial one should not use `--force`:

   ```bash
   git add .
   git commit -m 'Drupal 8 and dependencies'
   git push --force
   ```

   **Note:** the `vendor` directory is being committed to Pantheon. This is because Pantheon needs the full site artifact. If you prefer to ignore the `vendor` directory then take a look at [our Build Tools guide](/docs/guides/build-tools/) for documentation on the more advanced automated workflow with a build step.
   
## Install Drupal Commerce

 **Note:**
As packages pulled by Composer are updated (along with their dependencies), version compatibility issues can pop up. Sometimes you may need to manually alter the version constraints on a given package within the require or require-dev section of composer.json in order to update packages. See the updating dependencies section of Composer's documentation for more information.

As a first troubleshooting step, try running composer update to bring composer.lock up to date with the latest available packages (as constrained by the version requirements in composer.json).

1. Update `composer.json` add `composer_base` and its `dependencies` under `require` section.

   ```bash
   "drupal/swiftmailer": "1.x-dev",
   "drupal/entity": "1.x-dev",
   "drupal/inline_entity_form": "1.x-dev",
   "drupal/state_machine": "1.x-dev",
   "drupal/commerce": "2.15.0",
   "drupalcommerce/commerce_base": "dev-8.x-1.x"
    ```
    
2. Update `repositories` section of your `composer.json` file add `commerce_base`.

   ```bash
    "commerce_base": {
       "type": "vcs",
       "url": "https://github.com/drupalcommerce/commerce_base"
    }
    ```

3. Update `scripts` section add `remove-git-submodules` and update `post-update-command` add `@remove-git-submodules`.

   ```bash
   "remove-git-submodules": "find . -mindepth 2 -type d -name .git | xargs rm -rf"
    ```
      
4. Since we modified `composer.json` we will need to update Composer.

    ```bash
    composer update
    ```

5. Running `git status` should show new files `commerce_base` and its `dependencies`:

   ![Git Status showing updated Composer files](/source/docs/assets/images/guides/drupal-8-commerce-no-ci/git-status.png)

6. Commit the new files and push them to GitHub:

   ```bash
   git add .
   git commit -m "add commerce_base and its dependencies to project"
   git push origin master
   ```

## Reinstall Drupal

1. The Build Tools Plugin command we used earlier automatically installed Drupal's standard profile in the Dev environment for us. Now that we've installed the Commerce profile, we want that installed instead. Using Terminus, we can run the Drush command `site-install` which will first clear the database of the Standard profile before installing Commerce. This Drush command requires that the system be in writable (SFTP) mode:

   ```bash
   terminus connection:set $PANTHEON_SITE_NAME.dev sftp
   terminus drush $PANTHEON_SITE_NAME.dev -- site-install commerce
   ```

   Review the last two lines of output to identify the username and password created:

   ```bash
   Installation complete.  User name: admin  User password: jTHD8hd85U         [ok]
   Congratulations, you installed Drupal!                                  [status]
   ```


2. Log in to your Drupal site in the Dev environment. The presence of the **Commerce** button on the toolbar indicates a succefull install:

    ![Drupal Commerce in the Toolbar](/source/docs/assets/images/guides/drupal-8-commerce-no-ci/commerce-button.png)

## Conclusion

What you do next is up to you and your needs. Remember that you're now using Composer to manage core, modules, and dependencies for your site. Consider reading our [Composer Fundamentals and Workflows](/docs/composer) doc for more information.

##See Also

 - [Drupal Commerce](https://drupalcommerce.org/)
