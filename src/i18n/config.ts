import en from './messages/en.json'

// English only, to match the backend (emails etc. are English). The message
// layer stays so UI text is externalized and typed; adding a language later
// means adding a catalog AND sourcing the user's locale from the backend (see
// README), not a browser cookie.
export const messages = en
export type Messages = typeof en
