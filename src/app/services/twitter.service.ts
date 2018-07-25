import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions, URLSearchParams} from '@angular/http';
import * as jsSHA from "jssha";

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private static CONSUMER_KEY : string;
  private static CONSUMER_SECRET : string;
  private static TOKEN_KEY : string;
  private static TOKEN_SECRET : string;

  //service: TwitterService;
  shaObj: any;

  constructor(private http : Http) {
    
    TwitterService.CONSUMER_KEY = "jCyiOJCETgKutIQ42nOU1amXD";
    TwitterService.CONSUMER_SECRET = "9EzSlrEu0tqoky2LZNGlUTSL61QuJwD7hJKORa5PR9AdoIXUWw";
    TwitterService.TOKEN_KEY =" 2181893493-P0gJ9JpSCW2OIJg3XdSHmH0aSfKW8XpocvszcKy";
    TwitterService.TOKEN_SECRET="wkyJ9wN2SsLlQPhvuCYsTYylwa8m9pWXqbx3vE0bzI6do";
    this.shaObj = new jsSHA("SHA-1", "TEXT");
  }

  getTwits(hastag): Promise<any>
  { 
    var headers = new Headers();
    let url = `/1.1/search/tweets.json?q=${hastag}&count=50`;
    headers.append('Authorization', this.getAuthorization('GET', 'https://api.twitter.com' + url,{ 'q': hastag, 'count': 50}));
    
    return this.http.get(url, new RequestOptions({ headers: headers })).toPromise();
  }

  getAuthorization(httpMethod, baseUrl, reqParams)
  {
    // timestamp as unix epoch
    let timestamp  = Math.round(Date.now() / 1000);
    let nonce      = btoa(TwitterService.CONSUMER_KEY + ':' + timestamp);
    // generate signature from base string & signing key
    let baseString = this.oAuthBaseString(httpMethod, baseUrl, reqParams, TwitterService.CONSUMER_KEY, TwitterService.TOKEN_KEY, timestamp, nonce);
    let signingKey = this.oAuthSigningKey(TwitterService.CONSUMER_SECRET, TwitterService.TOKEN_SECRET);
    let signature  = this.oAuthSignature(baseString, signingKey);
    // return interpolated string
    return 'OAuth '                                           +
        'oauth_consumer_key="'  + TwitterService.CONSUMER_KEY + '", ' +
        'oauth_token="'         + TwitterService.TOKEN_KEY    + '", ' +
        'oauth_signature_method="HMAC-SHA1", '                +
        'oauth_timestamp="'     + timestamp                   + '", ' +
        'oauth_nonce="'         + nonce                       + '", ' +
        'oauth_version="1.0"'                                 +
        'oauth_signature="'     + signature                   + '"';
  }

  oAuthSigningKey(consumer_secret, token_secret) {
    return consumer_secret + '&' + token_secret;
  }

  oAuthSignature(base_string, signing_key) {
    var signature = this.hmac_sha1(base_string, signing_key);
    return this.percentEncode(signature);
  }

  oAuthBaseString(method, url, params, key, token, timestamp, nonce) {
    return method
            + '&' + this.percentEncode(url)
            + '&' + this.percentEncode(this.genSortedParamStr(params, key, token, timestamp, nonce));
  }

  percentEncode(str) {
    return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
      return '%' + character.charCodeAt(0).toString(16);
    });
  }

  genSortedParamStr(params, key, token, timestamp, nonce)  {
    // Merge oauth params & request params to single object
    let paramObj = this.mergeObjs(
        {
            oauth_consumer_key : key,
            oauth_nonce : nonce,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : token,
            oauth_version : '1.0'
        },
        params
    );
    // Sort alphabetically
    let paramObjKeys = Object.keys(paramObj);
    let len = paramObjKeys.length;
    paramObjKeys.sort();
    // Interpolate to string with format as key1=val1&key2=val2&...
    let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]];
    for (var i = 1; i < len; i++) {
        paramStr += '&' + paramObjKeys[i] + '=' + this.percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]));
    }
    return paramStr;
  }

  mergeObjs(obj1, obj2) {
    for (var attr in obj2) {
        obj1[attr] = obj2[attr];
    }
    return obj1;
  }

  hmac_sha1(string, secret) {
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(string);
    let hmac = shaObj.getHMAC("B64");
    return hmac;
  }
}
