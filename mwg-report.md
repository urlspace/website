## About

- [x] Lazy-load the below-the-fold author portrait. Use responsive image candidates sized for its rendered slot and check that narrow viewports do not fetch an image hidden by CSS.
- [x] Give the portrait concise alternative text that makes sense alongside the nearby author name and bio.

## Button

- [x] Default `ButtonBiggie` and `ButtonLinkLike` to `type="button"`. Keep submit behavior explicit at callers that need it.
- [x] Make both button variants suppress activation when `ariaDisabled` is true. Check click, Enter, and Space, including callers that retain focus at a disabled boundary.
- [ ] Verify that `ButtonBiggieLink` and `ButtonBiggieDownload` retain normal link behavior and visible focus. Check that each download label identifies the file and that the response triggers a download.

## CopyBox

- [ ] Make the full value readable and selectable by keyboard if clipboard access fails. The horizontal scroller hides its scrollbar and permanently fades the end of the value.
- [ ] Verify whether repeated copies of the same value are announced. Keep feedback in the mounted status region and prevent a late clipboard result from announcing a value the component no longer displays.
- [ ] Use the existing button name as the basis for a single tooltip experience. Check that the `interestfor` enhancement does not produce two tooltips with `title`.

## Dashboard

- [ ] Put skip links before the repeated header controls. Use fragment links to focusable targets and make sure the destinations scroll into view below the sticky header. Offer “Skip to links” on narrow screens and “Skip to filters” wherever the inline filters are visible.
- [ ] Expand the main landmark to include the results count, collection information, results, and pagination. Check that the page exposes one main landmark and that each skip target has a unique ID.

## DashboardAccordion

- [ ] Verify the native `<details>` and `<summary>` disclosure with Enter, Space, screen readers, and forced colors. Check that the custom chevron remains visible after the default marker is removed.
- [ ] Check that the initially open disclosures retain the user's collapsed state during filter updates and refetches.

## DashboardButton

- [ ] Check that collection names and counts clipped by the text container remain available to sighted keyboard and touch users. Test long names and high zoom in Safari.
- [ ] Verify that the selected toggle has a visible non-color cue and that focus remains identifiable on disabled rows and in forced colors.

## DashboardButtonAction

- [ ] Make compact actions such as Edit, Delete, and Rename meet the 24 CSS pixel target-size or spacing requirement. Check their focus outlines in forced colors. [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [ ] Ensure accessible names start with the visible action text, including when a caller replaces the label with pending text such as “Signing out…” or “Redirecting…”.

## DashboardButtonLink

- [ ] Verify that fragment links reach the intended section and leave keyboard users at the destination. Preserve Ctrl/Cmd-click and other modified-click behavior when a drawer supplies `onClick`.
- [ ] Support an explicit current-page state for navigation callers and check that the rendered anchor exposes the appropriate `aria-current` value.

## DashboardCollectionInfo

- [ ] Include the collection name in the accessible names of the Edit and Delete buttons so their targets are clear when navigating by buttons.
- [ ] Show a description row only when it has content. Choose a heading if this is a standalone section, or use a plain wrapper if the dashboard already provides the section heading.

## DashboardEmpty

- [ ] Announce “No links found” after a search or filter update through a status region that remains mounted. Coordinate it with `Stats` so the same result is announced once.

## DashboardList

- [ ] Replace the coarse-pointer rule that hides keyboard help with a control available on hybrid devices. A touchscreen can be used with an attached keyboard.
- [ ] Keep the `<ul>` and `<li>` semantics as marker styles change, and verify that a deleting row communicates pending state beyond the visual loading style.

## DashboardMenu

- [ ] Treat the inline row actions as a list of ordinary Tab stops. Preserve the list semantics and give the list a contextual name where several action groups appear together.
- [ ] Cap the stagger delay on long lists and show a focused action immediately, including when Tab reaches it before its fade-in starts.

## DashboardNav

- [ ] Place the collection and tag edit-mode controls before the actions they reveal, or move focus to the first revealed action on activation. Define a focus destination when edit mode ends or the last tag is removed.
- [ ] Partition collections into mutually exclusive private, public, and password-protected groups in one pass. Check that a protected collection cannot be shown twice when legacy data has inconsistent flags.

## Dialog

- [ ] Set initial focus for each dialog and restore focus to its opener or a logical surviving control. Give destructive confirmations a safe initial focus target.
- [ ] Guard cancel and close handlers against events from nested dialogs. Use native `closedby` for light dismiss where supported, with a fallback that requires both the start and end of the pointer gesture to be outside.
- [ ] Wait only for the dialog's exit animations and ignore stale close promises after a reopen. Test rapid open–close–open sequences and reduced-motion mode.

## Drawer

- [ ] Make a close request reach the parent once. The drawer currently calls `onClose` on the initial dismissal and again on the native `close` event.
- [ ] Reset swipe state on touch cancellation and nested-dialog interactions. Verify that horizontal scrolling and selection inside the drawer do not dismiss it.
- [ ] Verify initial focus, Escape, platform Back where supported, and focus restoration for both public navigation and dashboard filters.

## Features

- [ ] Mark up the five features as a list with a section heading and appropriately nested item headings.
- [ ] Check that the visual grid follows DOM reading and Tab order at each breakpoint and that text and links reflow at 320 CSS pixels.

## FileInput

- [ ] Keep the native file input's focus indication visible when the selection UI is overlaid. Check the visible button and filename in forced colors and at narrow widths.
- [ ] Adapt the visible picker text when `multiple` is enabled and let users inspect long filenames or multiple selections without relying on ellipsis.

## Footer

- [ ] Put the legal links in a labeled navigation list and render the copyright as text outside that list. Keep `Page.Footer` as the page's footer landmark.
- [ ] Check that the copyright, legal links, and controls wrap without overlap at narrow widths and high zoom.

## Form

- [ ] Add field-level validation to the shared form context. Link each error to the affected input, set `aria-invalid` when appropriate, and focus the first invalid field after submit. Keep request failures at form level.
- [ ] Keep a live region mounted for asynchronous feedback. Check that the busy state and disabled fields preserve a predictable focus location and that rapid submit attempts cannot start the request twice.

## FormCollection

- [ ] Move the upgrade button outside the visibility group's described-by text. Explain all visibility options to both free and paid users and associate slug or password errors with the relevant fields.
- [ ] When a save replaces the form with share details, move focus to the success message and expose the copy controls in a logical order.

## FormDeleteAccount

- [ ] Associate an incorrect-password response with the password field and focus it for correction. Keep the rate-limit message at form level.
- [ ] Give the surrounding confirmation dialog a safe Cancel action and initial focus target. Verify that successful deletion lands on a meaningful heading or main landmark after navigation.

## FormDeleteCollection

- [ ] Name the collection in the confirmation and describe what deleting it does to its public URL and to its links.
- [ ] Omit the cascade option when the collection has no links. Associate the consequences with the checkbox and keep the chosen state in place after a failed request.

## FormDeleteTag

- [ ] Name the tag being removed and associate the consequences of deleting linked bookmarks with the cascade checkbox.
- [ ] Omit the cascade option for a tag with no links. Verify that the confirmation label accurately reflects whether the action removes the tag alone or also deletes bookmarks.

## FormDisplayName

- [ ] Attach the whitespace-only validation error to Display name and state the allowed length in the field help.
- [ ] Verify that a successful save restores focus to “Change display name” and that the updated value is available without reopening the dialog.

## FormEmail

- [ ] Move focus to the step heading or code field after sending a code and announce which address received it. Give users a way to correct the address or request another code.
- [ ] Associate invalid or expired code responses with the code field and keep it editable. Test paste and one-time-code autofill with codes that start with zero.

## FormImport

- [ ] Clear the previous preview as soon as the source or files change. Catch read and parser failures, prevent stale results from replacing newer selections, and keep import unavailable while parsing.
- [ ] Announce parsing, ready, error, and completion states. Move focus to the result when it replaces the form.
- [ ] Profile a large bookmark export on a slower device. If parsing blocks input, move suitable parsing work off the main thread or break it into bounded chunks.

## FormLink

- [ ] Cancel metadata lookup when the URL is edited or cleared. Apply metadata only to the URL that initiated the request and to fields the user has left untouched.
- [ ] Apply metadata in a single update and announce completion once. Check that long descriptions remain easy to review and edit at narrow widths.
- [ ] Handle partial success when creating a collection succeeds but saving the link fails. Refresh the collection list and make retrying reuse the created collection.

## FormPassword

- [ ] Associate a password mismatch with the repeat field and an incorrect current password with the current-password field. Let users correct the field without re-entering the others.
- [ ] Check that the current-password field accepts all credentials that can still sign in. Apply the new-password length rules to the new credentials.

## FormTag

- [ ] Explain the leading, trailing, and repeated hyphen restrictions in the Tag name hint. Associate duplicate-name responses with that field.

## FormToken

- [ ] Reveal the one-time token as soon as creation succeeds, independently of the list refresh. Focus the success message, announce that the token is ready, and clear the password state.

## FormUsername

- [ ] Use `autocomplete="username"` for the sign-in identifier field. Check password-manager behavior when the dialog also includes a current-password input.
- [ ] Associate username availability errors with the username field and the public-URL warning with the change it describes. Verify that the warning is announced when it becomes relevant.

## Graph

- [ ] Give the indefinitely moving demo a pause control, or replace continuous motion and count updates with a static presentation. Keep the reduced-motion experience static. [WCAG pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [ ] Suspend animation and count updates when the demo is offscreen or the page is hidden. Measure the impact before adding extra rendering logic.

## HeaderProtected

- [ ] Expose the protected page header as the banner landmark in coordination with `Page.Header`. Check the landmark outline on Settings, Tools, and the protected error page.

## Heading

- [ ] Verify that long headings wrap inside the decorative background at high zoom and that the smaller heading levels remain legible with user text scaling.
- [ ] Check heading ranks at call sites and keep document hierarchy independent of visual size where the two need to differ.

## Icons

- [ ] Verify that icon-only controls get their accessible names from the enclosing button or link. Keep the SVGs decorative and provide text wherever an icon alone conveys a state.
- [ ] Check that focus, selection, and state icons remain visible with forced colors and increased text size.

## Intro

- [ ] Measure mobile and desktop LCP separately. Serve screenshot candidates sized for the mobile layout, size the image explicitly, and assign high fetch priority only where it is confirmed as the LCP image.
- [ ] Check the image waterfall across light, dark, and system themes. Avoid fetching the screenshot at desktop widths where the graph replaces it and avoid duplicate requests when the stored theme initializes.

## KeyboardShortcuts

- [ ] Add a way to turn off or remap global single-character shortcuts, including `/`. Document that control in the shortcut dialog. [WCAG character key shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)
- [ ] Clarify that `gg` is a sequence, `G` is uppercase, and holding `d` deletes the focused link. Keep the displayed commands and active shortcuts in sync.

## LinkCard

- [ ] Provide a cancelable Delete path for button activation and the hold shortcut. Announce deletion and restore focus to the next or previous card, or the results heading when the list is empty.
- [ ] Make pending favourite and for-later controls reflect whether they will accept another action. Verify that rapid updates and concurrent edits cannot overwrite newer bookmark data.
- [ ] Verify that long URLs and tags clipped by ellipsis can be inspected by keyboard and touch, and that the title link's focus remains visible in forced colors.

## LinkCardSlim

- [ ] Let the caller supply the heading rank where needed. Verify the heading order on public profiles and collections in both list and masonry views.
- [ ] Give users access to the full truncated destination and check that the external-link new-tab behavior is communicated consistently.

## Logo

- [ ] Include the destination in the brand link's accessible name where it differs between contexts, such as “url.space home” and “url.space dashboard”.
- [ ] Verify the icon-only link's hit area and focus visibility on both site themes and in forced colors.

## Manual

- [ ] Show which import source the ordered instructions apply to and verify that changing source refreshes the steps in place without moving focus unexpectedly.
- [ ] Check that long browser settings addresses and inline code wrap without obscuring the step number or creating page-wide scrolling.

## MenuElsewhere

- [ ] Associate the external link list with its visible label and verify that Safari with VoiceOver exposes its list structure when markers are removed.

## MenuTheme

- [ ] Present System, Light, and Dark as one named radio group with a single selected value. Keep the group name available when `hideTitle` is set and test native arrow-key selection.

## Page

- [ ] Offer a shared “Skip to main content” link before repeated navigation. Give `Page.Main` a focusable fragment target and ensure routes using `Public` provide the same destination.
- [ ] Coordinate `Page.Header`, `PublicHeader`, and `HeaderProtected` so each route exposes one banner, one main, and one footer landmark where present.

## Pagination

- [ ] Render Previous and Next as real links to the existing paginated URLs. Preserve filters and support opening a results page in a new tab.
- [ ] After navigation, announce the loaded page once and put focus where users can continue through the results. Check first and last pages and changes that reduce the page count.

## Pills

- [ ] When a focused removal button disappears, move focus to an adjacent removal button or back to the tag input.
- [ ] Add a visible outline in forced colors and check target spacing and wrapping with long tags, high zoom, and touch.

## Pricing

- [ ] Give the pricing section a heading and express the shared plan attributes with a comparison table using row and column headers. Check that comparisons still make sense on small screens.
- [ ] Distinguish checkout creation, actual redirection, and an existing-subscription response. A `409` currently leaves the action in the success-based “Redirecting…” state until the user data changes.
- [ ] Make the fair-use note usable from both references and verify that its text remains reachable by keyboard and screen reader.

## Prose

- [ ] Verify that fragment links land on visible headings below sticky UI at high zoom. Check policy text for wrapping with long links and unbroken strings.

## Public

- [ ] Use list semantics for collections and saved links in both layouts. Keep visual masonry placement consistent with reading and Tab order and provide a readable list fallback when `grid-lanes` is unavailable.
- [ ] Let the absolutely positioned options wrap or enter normal flow when space is limited. Verify that large text and high zoom leave both the heading and controls unobstructed.
- [ ] Put the password prompt in the primary content flow of the protected-collection view.

## PublicHeader

- [ ] Give the mobile Menu button a relationship to the drawer and expose its expanded state. Keep theme and other controls outside the primary navigation landmark.
- [ ] Mark the current destination in desktop and drawer navigation. Check breakpoint changes while the drawer is open so the disappearing trigger cannot strand focus.

## RadioGroup

- [ ] Keep `fieldset` and `legend`, and make the pending and disabled states consistent for the group and its individual options.
- [ ] Verify keyboard selection with disabled options and check long labels and focus visibility at narrow widths and in forced colors.

## SearchInput

- [ ] Let Tab and Shift+Tab move out of the combobox without committing an automatically highlighted suggestion. Verify arrows, Enter, Escape, pointer selection, and IME composition. [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [ ] Scope the `/` listener and CSS highlight registration to the active search instance. Preserve ordinary search where Popover, anchor positioning, or value-range highlighting is unavailable.
- [ ] Check that scrolling to the active suggestion scrolls the popup without jumping the dashboard or obscuring the input.

## Select

- [ ] Add labeled `<optgroup>` support for real categories such as import browsers and services. Keep a native `<select>` and verify group names with assistive technology. [HTML select and optgroup](https://html.spec.whatwg.org/multipage/form-elements.html#the-optgroup-element)
- [ ] Check long option labels, focus styling, and the required placeholder at high zoom and in forced colors.

## SettingsListAccount

- [ ] Expose payment processing and redirection through a persistent status message. Keep the Manage button's visible and accessible labels aligned.
- [ ] Make checkout conflicts recover when account data has not yet changed. Report the actual outcome and make the action retryable where appropriate.
- [ ] Let users read complete email addresses, usernames, and display names when the row layout truncates them.

## SettingsListSessions

- [ ] After remote sign-out removes the focused row, announce success and move focus to a surviving row or the section heading.
- [ ] Keep a failed confirmation available for retry and put its error inside the dialog. Verify that Escape and Cancel retain predictable behavior during a pending sign-out.

## SettingsListTokens

- [ ] Identify a token by its description and available suffix in the remove action and confirmation so tokens with the same description are distinguishable.
- [ ] Keep errors visible inside the confirmation. On success, announce the removal and restore focus to a surviving token action or the section heading.

## Stack

- [ ] Check row layouts with long labels and zoomed text. Allow wrapping where controls would otherwise overflow and keep keyboard order aligned with visual order.

## Stats

- [ ] Reserve zero for a confirmed empty result. Represent loading and failure separately and announce the settled result without transient “Results 0” or duplicate pagination announcements.

## TagsInput

- [ ] Disable Add tag whenever the editor is disabled or the form is busy. Explain the tag limit and why a duplicate or invalid tag was rejected.
- [ ] Check native datalist suggestions with keyboard, VoiceOver, zoom, and IME. Preserve manual tag entry and use an accessible combobox if users cannot operate the suggestions on supported browsers.
- [ ] Profile the height observer and animation while tags wrap. Keep the reduced-motion path free of animation and avoid animating layout if it adds measurable input delay.

## Toc

- [ ] Render each contents block as a named `<nav>` with its nested link lists intact. Use a label that distinguishes page contents or documentation navigation from the main site navigation.
- [ ] Verify list semantics after markers are removed and that in-page links reach visible headings below the sticky header.
