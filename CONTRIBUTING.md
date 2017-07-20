# Contributing to World Cleanup Day Mobile App

## Code of Conduct

* We are committed to providing a friendly, safe and welcoming environment for all, regardless of level of experience, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, or other similar characteristic.
* Please avoid using overtly sexual nicknames or other nicknames that might detract from a friendly, safe and welcoming environment for all.
* Please be kind and courteous. There's no need to be mean or rude.
* Respect that some individuals and cultures consider the casual use of profanity and sexualized language offensive and off-putting.
* Respect that people have differences of opinion and that every design or implementation choice carries a trade-off and numerous costs. There is seldom a right answer.
* Please keep unstructured critique to a minimum. If you have solid ideas you want to experiment with, make a fork and see how it works.
* We will exclude you from interaction if you insult, demean or harass anyone. That is not welcome behavior. We interpret the term "harassment" as including the definition in the [Citizen Code of Conduct](http://citizencodeofconduct.org/); if you have any lack of clarity about what might be included in that concept, please read their definition. In particular, we don't tolerate behavior that excludes people in socially marginalized groups.
* Private harassment is also unacceptable. No matter who you are, if you feel you have been or are being harassed or made uncomfortable by a community member, please contact one of the channel ops or any of the TSC members immediately with a capture (log, photo, email) of the harassment if possible. Whether you're a regular contributor or a newcomer, we care about making this community a safe place for you and we've got your back.
* Likewise any spamming, trolling, flaming, baiting or other attention-stealing behavior is not welcome.
* Avoid the use of personal pronouns in code comments or documentation. There is no need to address persons when explaining code (e.g. "When the developer").

## How you can contribute? 
Do you like to design?

* Create art for social media banners to promote the project

Do you like to write?

* Write and improve the project’s documentation
* Write social media posts about the project
* Proofread files 
* Write a translations

Do you like organizing?

* Link to duplicate issues, and suggest new issue labels, to keep things organized
* Ask clarifying questions on recently opened issues to move the discussion forward

Do you like to code?

* Find an open issue to tackle
* Improve tooling and testing

## Issue Contributions

When opening new issues or commenting on existing issues on this repository please make sure discussions are related to concrete technical issues with the
World Cleanup software.

Discussion of non-technical topics including subjects like intellectual property, trademark, and high level project questions should sent to
[World Cleanup Steering Committee (TSC)]() instead.

## Code Contributions

The WOrld Cleanup project has an open governance model and welcomes new contributors. Individuals making significant and valuable contributions are made
_Collaborators_ and given commit-access to the project. See the [GOVERNANCE.md](./GOVERNANCE.md) document for more information about how this
works.

This document will guide you through the contribution process.

### Step 1: Fork

Fork the project [on GitHub]() and check out your copy locally.

```text
$ git clone ...
$ cd node
$ git remote add upstream ...
```

#### Which branch?

For developing new features and bug fixes, the `master` branch should be pulled and built upon.


### Step 2: Branch

Create a branch and start hacking:

```text
$ git checkout -b my-branch -t origin/master
```

Any text you write should follow the style rules of each project and common best practices, including comments and API documentation.

### Step 3: Commit

Make sure git knows your name and email address:

```text
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Add and commit:

```text
$ git add my/changed/files
$ git commit
```

Writing good commit logs is important. A commit log should describe what changed and why. Follow these guidelines when writing one:

1. The first line should be 50 characters or less and contain a short description of the change. All words in the description should be in
   lowercase with the exception of proper nouns, acronyms, and the ones that refer to code, like function/variable names. The description should
   be prefixed with the name of the changed subsystem and start with an imperative verb. Example: "net: add localAddress and localPort
   to Socket"
2. Keep the second line blank.
3. Wrap all other lines at 72 columns.

A good commit log can look something like this:

```txt
subsystem: explain the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way, `git log` will show things
nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they run `git shortlog` or `git log --oneline`.

Check the output of `git log --oneline files_that_you_changed` to find out what subsystem (or subsystems) your changes touch.

If your patch fixes an open issue, you can add a reference to it at the end of the log. Use the `Fixes:` prefix and the full issue URL. For other references
use `Refs:`. For example:

```txt
Fixes: /issues/1337
Refs: http://eslint.org/docs/rules/space-in-parens.html
Refs: /pull/3615
```

### Step 4: Rebase

Use `git rebase` (not `git merge`) to sync your work from time to time.

```text
$ git fetch upstream
$ git rebase upstream/master
```

### Step 5: Test

Do a manual and regression testing for what you built.

### Step 6: Push

```text
$ git push origin my-branch
```

Go to https://github.com/yourusername/node and select your branch.
Click the 'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days.

### Step 7: Discuss and update

You will probably get feedback or requests for changes to your Pull Request.
This is a big part of the submission process so don't be disheartened!

To make changes to an existing Pull Request, make the changes to your branch.
When you push that branch to your fork, GitHub will automatically update the Pull Request.

You can push more commits to your branch:

```text
$ git add my/changed/files
$ git commit
$ git push origin my-branch
```

Or you can rebase against master:

```text
$ git fetch --all
$ git rebase origin/master
$ git push --force-with-lease origin my-branch
```

Or you can amend the last commit (for example if you want to change the commit log).

```text
$ git add any/changed/files
$ git commit --amend
$ git push --force-with-lease origin my-branch
```

**Important:** The `git push --force-with-lease` command is one of the few ways to delete history in git. Before you use it, make sure you understand the risks. If in doubt, you can always ask for guidance in the Pull Request or on [IRC in the #node-dev channel](https://webchat.freenode.net?channels=node-dev&uio=d4).

Feel free to post a comment in the Pull Request to ping reviewers if you are awaiting an answer on something. If you encounter words or acronyms that
seem unfamiliar, refer to this [glossary](https://sites.google.com/a/chromium.org/dev/glossary).

Note that multiple commits often get squashed when they are landed (see the notes about [commit squashing](#commit-squashing)).

### Step 8: Landing

In order to land, a Pull Request needs to be reviewed and [approved]() by at least one World Cleanup Collaborator and pass a
[CI (Continuous Integration) test run](#ci-testing).
After that, as long as there are no objections from a Collaborator, the Pull Request can be merged. If you find your Pull Request waiting longer than you expect, see the [notes about the waiting time](#waiting-until-the-pull-request-gets-landed).

When a collaborator lands your Pull Request, they will post a comment to the Pull Request page mentioning the commit(s) it landed as. GitHub often shows the Pull Request as `Closed` at this point, but don't worry. If you look at the branch you raised your Pull Request against (probably `master`), you should see a commit with your name on it. Congratulations and thanks for your contribution!

## Additional Notes

### Commit Squashing

When the commits in your Pull Request land, they will be squashed into one commit per logical change. Metadata will be added to the commit
message (including links to the Pull Request, links to relevant issues, and the names of the reviewers). The commit history of your Pull Request,
however, will stay intact on the Pull Request page.

For the size of "one logical change", [0b5191f](/commit/0b5191f15d0f311c804d542b67e2e922d98834f8) can be a good example. It touches the implementation, the documentation, and the tests, but is still one logical change. In general, the tests should always pass when each individual commit lands on the master branch.

### Getting Approvals for Your Pull Request

A Pull Request is approved either by saying LGTM, which stands for "Looks Good To Me", or by using GitHub's Approve button. GitHub's Pull Request review feature can be used during the process.
For more information, check out the official documentation](https://help.github.com/articles/reviewing-changes-in-pull-requests/).

After you push new changes to your branch, you need to get approval for these new changes again, even if GitHub shows "Approved" because the reviewers have hit the buttons before.

### CI Testing

Every Pull Request needs to be tested to make sure that it works on the platforms that World Cleanuo supports. This is done by running the code through the CI system.

Only a Collaborator can start a CI run. Usually one of them will do it for you as approvals for the Pull Request come in.
If not, you can ask a Collaborator to start a CI run.

### Waiting Until the Pull Request Gets Landed

A Pull Request needs to stay open for at least 48 hours (72 hours on a weekend) from when it is submitted, even after it gets approved and
passes the CI. This is to make sure that everyone has a chance to weigh in. If the changes are trivial, collaborators may decide it
doesn't need to wait. A Pull Request may well take longer to be merged in. All these precautions are important because World Cleanup is widely used, so don't be discouraged!

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or

* (b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or

* (c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.

* (d) I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.
