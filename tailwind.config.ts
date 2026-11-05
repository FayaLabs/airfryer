import { fayzTailwind } from '@fayz-ai/ui/tailwind'

// The helper scans the installed @fayz-ai/* dist for the utilities the SDK's
// components use; without that scan the shell renders with classes the CSS
// does not have.
export default fayzTailwind({ sdkDir: './node_modules/@fayz-ai' })
