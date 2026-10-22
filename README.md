# Verba Connect for IINA

Select a word in the subtitles and add it to [Verba](https://verba.s4y.solutions).

The plugin shows the subtitles itself, so you can select text with the mouse. Press a key and your browser opens
Verba with the word in the add form. Nothing is saved until you press Add in Verba.

## Install

In IINA: Settings > Plugins > Install from GitHub, then enter `s4ysolutions/iina-verba`.

For developers: link the folder (needs the `iina-plugin` command line tool):

    git clone https://github.com/s4ysolutions/iina-verba
    iina-plugin link ./iina-verba

Verba web app: https://verba.s4y.solutions

## Use

1. Play a video with subtitles.
2. Pause on a line.
3. Select a word (or a phrase) in the subtitle with the mouse.
4. Press `a` (or use the menu Plugin > Add to Verba).
5. The browser opens Verba with the word.

The link carries only the word. Pick the word language in the add form.

If nothing is selected, the whole subtitle line is used. A new subtitle line clears the selection, so pause first.

## Known limit

Each press opens a new browser tab.

## Preferences

IINA > Settings > Plugins > Verba Connect > Preferences.

- Verba server URL. Default: `https://verba.s4y.solutions`.
- Shortcut. Default: `a`. The key is read when IINA starts, so restart IINA after you change it.

## Permissions

- `video-overlay`: shows the subtitles on the video so you can select text.
- `show-osd`: shows a short message on the video (the word you added, or "no subtitle").

The plugin has no network permission. It only asks your browser to open a link.

## Credit

Based on [kerim/iina-clickable-subtitles](https://github.com/kerim/iina-clickable-subtitles) by P. Kerim Friedman
(MIT). See `LICENSE`.
