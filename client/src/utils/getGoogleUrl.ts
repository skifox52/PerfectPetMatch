function getGoogleUrl() {
  const rootURL = "https://accounts.google.com/o/oauth2/auth"
  const options = {
    redirect_uri: import.meta.env.VITE_REDIRECT_URI as string,
    client_id: import.meta.env.VITE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  }
  const qs = new URLSearchParams(options)
  return `${rootURL}?${qs}`
}

export default getGoogleUrl
