---
title: Rebuilding Commit History by Changing Line Endings
type: post
published_at: '2025-05-07T19:18:35.000Z'
updated_at: '2025-05-07T19:18:35.000Z'
excerpt: >-
  Learn how to change line endings in your commit history using git-filter-repo,
  ensuring your codebase maintains consistency across different environments.
tags:
  - line-endings
  - commit-history
  - git-filter-repo
feature_image: null
meta_title: null
meta_description: >-
  Learn how to change line endings in your commit history using git-filter-repo,
  ensuring your codebase maintains consistency across different environments.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20261003044241'
---

<p>Managing line endings in a codebase can often be a tricky endeavor, especially when collaborating across different platforms. Windows and Unix-like systems handle line endings differently, which can lead to issues when sharing code. Fortunately, there are tools available that can help us maintain consistency in our commit history when it comes to line endings. One such tool is <code>git-filter-repo</code>, which allows you to rewrite your repository's history with ease.</p><p>To get started, you need to install <code>git-filter-repo</code>. This tool is designed to replace the older <code>git filter-branch</code> command with a more efficient and simpler approach. You can find the installation instructions and prerequisites on its <a href="https://github.com/newren/git-filter-repo?tab=readme-ov-file&amp;ref=git.wtf#prerequisites">official GitHub page</a>. After installation, ensure that it is added to your <code>$PATH</code> so that you can call it from the command line.</p><p>Once you have <code>git-filter-repo</code> set up, it’s essential to work on a fresh clone of your repository to avoid any accidental data loss. It’s also a good practice to back up your repository before proceeding with any history rewriting. You can create a backup by simply cloning your repository into a new directory.</p><p>The core of the process lies in running a command that specifies how to handle the file contents. Here’s a snippet of the command that you will need to execute:</p><pre><code class="language-sh">git-filter-repo --file-info-callback '  
    contents = value.get_contents_by_identifier(blob_id)  
    ext = filename.lower().split(b".")[-1]  
    if ext not in [b"c", b"cpp", b"h", b"hpp"] or \  
            value.is_binary(contents):  
        # Make no changes to the file; return as-is  
        return (filename, mode, blob_id)  

    new_contents = contents.replace(b"\r\n", b"\n")  
    new_blob_id = value.insert_file_with_contents(new_contents)  

    return (filename, mode, new_blob_id)  
'  
</code></pre><p>This command does a few things:</p><ul><li>It retrieves the contents of each file identified by its <code>blob_id</code>.</li><li>It checks the file extension to determine whether it should modify the file. In this case, it targets only C and C++ files, ignoring binary files and others.</li><li>If the file qualifies for modification, it replaces Windows-style line endings (<code> </code>) with Unix-style line endings (<code> </code>).</li><li>Finally, it inserts the modified contents back into the repository.</li></ul><p>This approach ensures that your commit history reflects the correct line endings without altering the integrity of your binary files or other types of files that shouldn't be affected.</p><p>For further reading on how to use <code>git-filter-repo</code> and its capabilities, refer to the <a href="https://github.com/newren/git-filter-repo/blob/main/README.md?ref=git.wtf">official documentation</a>. Understanding these commands can greatly enhance your ability to manage your codebase and keep it clean and consistent across different environments.</p>
