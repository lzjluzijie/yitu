# yitu

## Authorization

https://docs.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online#code-flow

You need to get access token and refresh token first. 

### Get authorization code with your browser

https://login.microsoftonline.com/common/oauth2/v2.0/authorize?access_type=offline&client_id=4caae01e-515a-490f-bde7-92cff3b895ac&response_type=code&scope=Files.Read+Files.ReadWrite+Files.Read.All+Files.ReadWrite.All+offline_access

Open this url with your browser. After a few clicks, you will be redirect to `http://127.0.0.1:23333`, the authorization code is in the url params.


### Redeem the code for tokens

```http request
POST https://login.microsoftonline.com/common/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id=4caae01e-515a-490f-bde7-92cff3b895ac&redirect_uri=http://127.0.0.1:23333&client_secret=qohmO45%%-jtxUVCAGP372{
&code=YOUR_CODE_HERE&grant_type=authorization_code
```

curl
```bash
curl -d "client_id=4caae01e-515a-490f-bde7-92cff3b895ac&redirect_uri=http://127.0.0.1:23333&client_secret=qohmO45%%-jtxUVCAGP372{&code=YOUR_CODE_HERE&grant_type=authorization_code" -X POST https://login.microsoftonline.com/common/oauth2/v2.0/token
```
