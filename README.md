# Elementor Reloader

Elementor Reloader is a lightweight Chrome extension that automatically fixes common Elementor editor crashes by clearing cookies and reloading the page. It also tracks how much time you’ve saved thanks to automatic fixes.

## Features

- Automatic crash recovery  
  Detects known Elementor JavaScript errors (like “Cannot convert undefined or null to object”) and reloads the editor automatically.

- Cookie cleanup  
  Removes cookies that may prevent Elementor from loading properly.

- Time saved tracker  
  Keeps count of the number of fixes and estimates total time saved (10 seconds per fix).

- Popup dashboard  
  Shows total fixes, estimated time saved, and lets you reset the stats at any time.

- Privacy friendly  
  No data is collected or sent anywhere. Everything runs locally in your browser.

## How it works

1. The extension watches for known Elementor editor errors on `/wp-admin/post.php?action=elementor`.
2. When detected, it removes all cookies from the current domain.
3. The page automatically reloads.
4. Each fix adds 10 seconds to your total “time saved”.


## Permissions

- `cookies` – used to remove domain cookies during a fix  
- `tabs` – used to reload the current page  
- `storage` – used to keep the time saved and fix counter  
- `host_permissions` – allows the extension to work on Elementor pages on any domain

## Privacy Policy

Elementor Reloader does not collect, transmit, or store any personal data.  
All actions happen locally inside your browser. The extension only uses local storage to track the number of fixes and time saved.

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).