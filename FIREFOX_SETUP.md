# Permanent Firefox installation

The repository can build and submit a Firefox package to Mozilla for signing with one GitHub Actions run. This creates an **unlisted** add-on: a public Mozilla store listing is not required. The resulting signed `.xpi` works on Firefox 140+ for Mac, Windows, and Linux and stays installed after restarting Firefox.

The signing workflow is ready; no signed installer is supplied until a signing run succeeds. Mozilla may require review, so completion is not guaranteed to be immediate.

## One-time setup

1. Sign in to the [Mozilla add-on API credentials page](https://addons.mozilla.org/developers/addon/api/key/). Create a Mozilla account if needed, complete Mozilla's developer onboarding, and generate API credentials.
2. Open [this repository's Actions secrets](https://github.com/tobiko-dev/google-translate-eraser/settings/secrets/actions). Use **New repository secret** twice:

   | Secret name | Value from Mozilla |
   | --- | --- |
   | `AMO_JWT_ISSUER` | JWT issuer / API key |
   | `AMO_JWT_SECRET` | JWT secret / API secret |

   Paste these directly into GitHub's secret fields. Do not put them in chat, source files, issues, or screenshots.
3. Open [Build permanent Firefox add-on](https://github.com/tobiko-dev/google-translate-eraser/actions/workflows/firefox-sign.yml). Click **Run workflow**, use branch **main**, leave version **1.1.2** for the first submission, leave signing enabled, and run it.

No terminal or developer tools are required on your Mac.

## Install the result

1. Open the successful run and download its **firefox-signed-1.1.2** artifact under **Artifacts**. Unzip that outer download to get the `.xpi` file. Do not unzip the `.xpi` itself.
2. Remove the old temporary copy from `about:debugging#/runtime/this-firefox`. Open `about:addons`, click the gear icon, select **Install Add-on From File…**, and choose the `.xpi`.
3. Confirm installation and allow access to Google Translate if Firefox asks. Refresh [Google Translate Images](https://translate.google.com/?op=images) and use the backtick key outside text fields.

Keep the downloaded `.xpi` for reinstalling on your other computers. GitHub artifacts expire after 90 days; expiration does not affect an installed extension.

## Later updates and retries

Run the same workflow with a higher version, such as `1.1.3`, after updating the code, then install the newly signed `.xpi`. The stable Firefox add-on ID lets it replace the existing signed installation. This workflow automates packaging and signing; it does not configure automatic browser updates.

If signing times out or reports an existing version, check [Mozilla's developer hub](https://addons.mozilla.org/developers/) before retrying: the submission may already exist or still be awaiting review. Retrieve the signed version there if it has finished. Do not repeatedly submit the same accepted version. If Mozilla requires account setup, agreement acceptance, or reviewer information, complete that step in the developer hub.

To validate without submitting to Mozilla, uncheck **Submit to Mozilla for signing** when running the workflow. That run produces an unsigned ZIP, which cannot be installed permanently in standard Firefox.

## What the automation does

The builder copies only `content.js` and `content.css`, then creates a Firefox-specific manifest with a stable add-on ID, the selected version, Firefox 140 minimum, and a no-data-collection declaration. The existing root manifest and Edge/Brave download stay unchanged. Mozilla's `web-ext` validates, packages, submits, and downloads the signed installer. Credentials are supplied only to the steps that need them through GitHub Actions secrets.

The workflow runs manually, has read-only repository permissions, does not publish a GitHub release, and never runs on pull requests. The signed artifact is attached to its workflow run.

[Mozilla signing documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign) · [Installing signed extensions](https://extensionworkshop.com/documentation/publish/install-self-distributed/)
