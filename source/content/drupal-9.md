---
title: Drupal 9 Early Access
description: Test the latest Drupal on the Pantheon Website Management Platform.
categories: [get-started]
tags: [site]
earlyaccess: true
contributors: [populist, edwardangert]
reviewed: "2020-05-21"
---

Drupal 9 is, according to [drupal.org](https://www.drupal.org/docs/understanding-drupal/drupal-9-resources), "a cleaned-up version of Drupal 8... \[with] deprecated code removed and third-party dependencies updated."

Drupal 9 updates Drupal’s underlying dependencies like [Symfony 4.4](https://symfony.com/releases/4.4) and [Twig 2](https://twig.symfony.com/doc/2.x/index.html), removes several deprecated API functions in favor of better options, and allows everyone running Drupal 8.8+ an easy upgrade path to Drupal 9.

<Alert title="Warning" type="danger">

This is Early Access to a Pantheon feature release in active development, and is intended for testing and evaluation purposes only. **Sites will be deleted without notice**.

</Alert>

Choose one of the following methods to get started with a new Drupal 9 site, to test your existing site's [compatibility with an upgrade](#test-an-existing-drupal-site-for-drupal-9-upgrade-compatibility), or to [test run your Pantheon Drupal 8 site on Drupal 9](#test-upgrade-an-existing-pantheon-drupal-8-site-to-drupal-9).

## Drupal 9 and Integrated Composer - Create a New Drupal 9 Site

Join our early access program to test out both Drupal 9 and Pantheon native Composer support.

1. [Fill out this form](https://docs.google.com/forms/d/1lahWKMT2VHXfr9hg15VIQY2Kn6z_j77o7Te6hZqsNgw) to get access to our “Drupal 9 Early Access” group.

1. Once you have been added to the group, spin up a new Drupal 9 site with `ic-demo-2020-` as a site name prefix (i.e., `ic-demo-2020-matt-d9-test`). This will give you [Drupal 9 starter codebase](https://github.com/stevector/drupal-9-project) and will automatically trigger a Composer install and `git commit` on site creation.

## Create a New Drupal 9 Site with Continuous Integration via Build Tools

Want to regularly develop with continuous integration (CI) and automated tests? Leverage Pantheon’s [Build Tools](/guides/build-tools) to get up and running quickly with a CI workflow (CircleCI, BitBucket, GitLab), to build, test, and deploy Drupal 9.

1. Install the [Terminus Build Tools plugin](https://github.com/pantheon-systems/terminus-build-tools-plugin).
   - This will require generating a Pantheon machine token, a CircleCI API token, and a GitHub API credential.
1. Enable support for custom CircleCI Orbs in your Organizational settings. In CircleCI, click **Settings**, then **Security**, and click **Yes** to allow uncertified orbs:
   ![Allow Uncertified Orbs in CircleCI](../images/circleci/circleci-allow-uncertified-orbs.png)
1. Use Terminus to create a new Drupal 9 site, complete with a customizable CI workflow. Remember to replace `<NEW-SITE-NAME>` in this example with your new site name:

  ```bash{promptUser: user}
  terminus build:project:create stevector/drupal-9-with-pantheon-orb <NEW-SITE-NAME> --stability=dev
  ```

1. Clone your D8 [site’s codebase to your computer](https://pantheon.io/docs/local-development#get-the-code). You can create a new D8 site or use an existing D8 site:

  ```bash{promptUser: user}
  git clone <url-for-site-repo>
  ```

1. Use Terminus to create a [Multidev](/multidev) environment called `update-9.0.0-beta3` on your D8 site for testing:

  ```bash{promptUser: user}
  terminus multidev:create <site>.<env> update-9.0.0-beta3
  ```

1. Create and switch to a new testing branch in the D8 codebase:

  ```bash{promptUser: user}
  git checkout -b update-9.0.0-beta3
  ```

1. Pull the `update-9.0.0-beta3` branch into your codebase:

  ```bash{promptUser: user}
  git pull https://github.com/pantheon-systems/drops-8.git update-9.0.0-beta3
  ```

1. Modify the `pantheon.yml` file to specify PHP 7.4 and Drush 8:

  ```yaml:title=pantheon.yml
  php_version: 7.4
  drush_version: 8
  ```

1. Run `update.php` on your new Drupal 9 site:

  ```bash{promptUser: user}
  terminus drush <site>.<env> updatedb
  ```

## Test an Existing Drupal Site for Drupal 9 Upgrade Compatibility

1. Review the [How to Prepare Your Drupal 7 or 8 Site for Drupal 9](https://www.drupal.org/docs/9/how-to-prepare-your-drupal-7-or-8-site-for-drupal-9) guide on Drupal.org.
1. Use the [Upgrade Status Drupal 8/9 module](https://www.drupal.org/project/upgrade_status) to generate a full report of your site’s compatibility.
1. Check out [Acquia’s Drupal 9 Deprecation Status Upgrade Tracker](https://dev.acquia.com/drupal9/deprecation_status) for information about D9 support for contributed Drupal modules and themes.

### Update Deprecated Code for Drupal 9 Compatibility

Drupal 9 has deprecated a number of different functions and APIs in favor of better options going forward.

For example, `node_load()` was replaced in Drupal 9 with `Node::load` resulting in this change needing to be made:

Drupal 8:

```none
$node = node_load(1);
```

Drupal 9:

```none
use \Drupal\node\Entity\Node;
$node = Node::load(1);
```

Since most of these changes are relatively minor, there are a number of [deprecation checking and correction tools](https://www.drupal.org/docs/9/how-to-prepare-your-drupal-7-or-8-site-for-drupal-9/deprecation-checking-and-correction-tools) available.

## Test Upgrade an Existing Pantheon Drupal 8 Site to Drupal 9

Already running a Pantheon site using our [Drupal 8 upstream](https://github.com/pantheon-systems/drops-8)? Want to spin up one real quick to test it out? Leverage the amazing power of our Multidev tooling to test Drupal 9 in a git branch.

1. Clone your D8 [site’s codebase to your computer](https://pantheon.io/docs/local-development#get-the-code). You can create a new D8 site or use an existing D8 site:

  ```bash{promptUser: user}
  git clone <url for site repo>
  ```

1. Use Terminus to create a [Multidev](/multidev) environment called `d9-beta` on your D8 site for testing:

  ```bash{promptUser: user}
  terminus multidev:create <site>.<env> d9-beta
  ```

1. Create and switch to a new testing branch in the D8 codebase:

  ```bash{promptUser: user}
  git checkout -b d9-beta
  ```

1. Pull the `drupal9-beta3-early-access-not-for-production-use` branch into your codebase:

  ```bash{promptUser: user}
  git pull https://github.com/pantheon-systems/drops-8.git drupal9-beta3-early-access-not-for-production-use
  ```

1. Modify the `pantheon.yml` file to specify PHP 7.4 and Drush 8:

  ```yaml:title=pantheon.yml
  php_version: 7.4
  drush_version: 8
  ```

1. Run `update.php` on your new Drupal 9 site:

  ```bash{promptUser: user}
  terminus drush <site>.<env> updatedb
  ```

## FAQ

### Pantheon Drupal 8 Modules Being Upgraded to Drupal 9

| Module Name                                                                                 | D8 Version? | D9 Version? |
|---------------------------------------------------------------------------------------------|:-----------:|:-----------:|
| [Pantheon Advanced Page Cache](https://www.drupal.org/project/pantheon_advanced_page_cache) |     Yes     |     Yes     |
| [Search API Pantheon](https://www.drupal.org/project/search_api_pantheon)                   |     Yes     |   Not yet   |

## Where can I report an issue?

Drupal 9 issues can be reported in [this GitHub Issue Queue](https://github.com/stevector/drupal-9-with-pantheon-orb/issues).