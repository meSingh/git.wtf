---
title: 'How to Create a Tag in a GitHub Repository: A Step-by-Step Guide'
type: post
published_at: '2023-12-08T05:00:11.000Z'
updated_at: '2023-12-08T05:00:11.000Z'
excerpt: >-
  Tags in Git are pointers to specific points in a repository's history,
  typically used for marking release points (v1.0, v2.0, etc.). Git supports two
  types o...
tags:
  - learn-git
  - git-tag
  - git-pull
  - git-push
feature_image: null
meta_title: null
meta_description: null
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713152652'
---

<p>Tags in Git are pointers to specific points in a repository's history, typically used for marking release points (v1.0, v2.0, etc.). Git supports two types of tags: lightweight and annotated. Understanding how to create and manage these tags is essential for effective version control and release management in GitHub repositories.</p><hr><h4 id="understanding-tag-types">Understanding Tag Types</h4><ol><li><strong>Lightweight Tags</strong>: These are like static branches. A lightweight tag is simply a reference to a specific commit.</li><li><strong>Annotated Tags</strong>: These are stored as full objects in the Git database. They include metadata such as the tagger’s name, email, date, and a tagging message. Annotated tags are recommended for most use cases because they contain more information.</li></ol><hr><h4 id="creating-tags">Creating Tags</h4><ul><li><strong>Create a Lightweight Tag</strong>:</li></ul><pre><code class="language-shell">git tag &lt;tagname&gt;</code></pre><p>Example:</p><pre><code class="language-shell">git tag v1.0.0</code></pre><ul><li><strong>Create an Annotated Tag</strong> (Recommended):</li></ul><pre><code class="language-shell">git tag -a &lt;tagname&gt;</code></pre><p>Example:</p><pre><code class="language-shell">git tag -a v1.0.0</code></pre><p><br>To add a message to your tag, which is highly recommended for annotated tags, use:</p><pre><code class="language-shell">git tag -a &lt;tagname&gt; -m "tag description"</code></pre><p><br>Example:</p><pre><code class="language-shell">git tag -a v1.0.0 -m "First release"</code></pre><hr><h4 id="pushing-tags-to-your-remote-repository">Pushing Tags to Your Remote Repository</h4><p>By default, tags are not automatically pushed to your remote repository. You need to explicitly push them.</p><ul><li><strong>Push All Local Tags</strong>:</li></ul><pre><code class="language-shell">git push origin --tags</code></pre><ul><li><strong>Push a Single Tag</strong>:</li></ul><pre><code class="language-shell">git push origin &lt;tagname&gt;</code></pre><p>Example:</p><pre><code class="language-shell">git push origin v1.0.0</code></pre><hr><h4 id="listing-all-tags">Listing All Tags</h4><p>To view all the tags you have created in your repository, simply use:</p><pre><code class="language-shell">git tag</code></pre><p>This command lists all the tags in alphabetical order.</p>
