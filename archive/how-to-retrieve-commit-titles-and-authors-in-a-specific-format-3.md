---
title: How to Retrieve Commit Titles and Authors in a Specific Format
type: post
published_at: '2024-07-25T13:00:44.000Z'
updated_at: '2024-07-25T13:00:44.000Z'
excerpt: >-
  Learn how to format and display commit titles and authors using command line
  tools for better visibility in your project history.
tags:
  - commit-history
  - software-development
  - version-control
feature_image: null
meta_title: null
meta_description: >-
  Learn how to format and display commit titles and authors using command line
  tools for better visibility in your project history.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20261003044921'
---

<p>In software development, tracking changes is crucial for collaboration and project management. One of the common tasks developers face is reviewing commit history to understand contributions and changes made over time. A handy command for extracting commit titles and their corresponding authors is <code>git cherry</code>, which can be tailored to meet specific formatting needs.</p><p>To get started, the <code>git cherry</code> command provides a custom reformat of certain <code>git log</code> options, particularly useful for symmetric ranges. This command is particularly helpful when you want to compare two branches, like <code>master</code> and <code>release</code>.</p><p>To see all the commit titles along with their authors, you can use the following command:</p><pre><code>git cherry -v master release | cut -d " " -f3-
</code></pre><p>This command effectively lists the commits from the <code>release</code> branch that are not in <code>master</code>, showing you the unique changes made. However, if you want a more detailed view with specific formatting, you can leverage the <code>git log</code> command with the <code>--cherry</code> option. This allows you to visualize commits in a more structured manner.</p><p>To get a formatted list of commits, you can execute:</p><pre><code>git log --cherry --oneline master...release
</code></pre><p>This command provides a concise overview of the commits, but if you require more details, such as the commit message and the author's name, you can further customize the output using the <code>--pretty</code> option. Here’s how you can do that:</p><pre><code>git log --cherry master...release --pretty='%m %s @%an'
</code></pre><p>In this command:</p><ul><li><code>%m</code> represents the commit message.</li><li><code>%s</code> represents the subject of the commit.</li><li><code>@%an</code> includes the author's name.</li></ul><p>By utilizing these commands, developers can gain insight into the project's history in a clean format that highlights both the changes made and the contributors responsible for those changes. This process not only aids in understanding the progression of the project but also fosters better collaboration among team members.</p><p>For those looking to dive deeper, the official documentation provides comprehensive details on the various options available with <code>git log</code>. Exploring these options can greatly enhance your workflow and improve the way you manage your project's version history.</p>
