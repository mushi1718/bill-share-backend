import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// TODO: Replace with your actual Firebase service account credentials
// You can download this JSON file from the Firebase Console:
// Project Settings -> Service accounts -> Generate new private key
const serviceAccount: ServiceAccount = {
  projectId: "turtlehub-d81a9",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCj0D18mHnpKKVN\nn4yo3dWGP3uvnUP7AgKsH+GrgqjZbI3DQhyoA4gdR0MwBQNJtTNyb0vysLxXbVVw\nL+F34qJSnWNzoWVWrf98Ui1gv3W/AwcrjvJ1v8Y184SIG8h2Ibq8hu3homAZPSpu\nDi2RqDbF62sYALpV8mLb4GtZrZSsQt2QJXwOIfH+SDcs6cMk5DQJfANASfPhWCmk\nBiYazbwqSv7AKofcvEWml45BsBsS9lJktVT5Cw+BlttNIWZb5GuGde6A5RygfDFm\ndjnDkJUwLue6EEPkvgPPckQ27JK2EzmWV7iXZHaCkNYe8hMpqrLmpEc3X+fNJE9q\nKKtCDK2NAgMBAAECggEAIOm0iOWbzPBZMhzl5oHXpmb342NuJq8TOWEYdtzELxcj\n7oDIgCthfDx2r925+OO6x/m7oTHITaqOeYFtRCiZY47yzec2FLHV/LUIIAGn1y51\nENfiOC1FVk6sqKooXy/MtJdJkUWOGFQVQ9J+bl8FTkPMGyD+T0lpenL/Lp/1GJzu\nPydPJnQAsa0MhmPBzTgSRrfQ1TvZriZ9wPzFSfbLFRxQUhoQ/u/tqQ1YOPgnF3Yj\nCJWz1ZD9Ek4RG2r2pkfeHwP0lIslP8axjZtroAeXsiKIF989UtmUJ4udLcmz2mft\nmZrvQy9Bav2Lq4/7xbdk0OJKxKxfkLNBVTvQkk3HkQKBgQDXyIDAa3mXFAEeSt8/\nt/qNFZSuzOMOFnsesFlOXBclKOdQTae343x2yoXZai0cuHYqC1sdFtvg+Zk5WRgJ\nf47AOc8KGmnEz0mVAZxrT8IhIlGWI2R+RmRi+lvU9xjR2OJOza4mwOhLoqVNAwCz\nxnCOkpv3j0ujN4FM0tjL+1xaWQKBgQDCWCTFUnAReGIFK5CDJ1o16ZaE3qEyEAi4\nfWaEMHI7R+WpNZoci4ziGQJo+8hmToAl4qVXz7zLD6wk3W8hK2ny5+cqOcBlB4do\n4IVJ1L+xT5VISZtedWXY62lNCJ1fNKn9qUNgWypQwxGyXNEzGuGEC2pLfybDHEFc\n7XmoCiZeVQKBgEdPUY1Fd0dAKyZxo9mQ2VIqoZoqx5ZuQ33e1YSZ1mRHYjodj6Gr\nogQ35Yf2GLZ3F0XJvvCcD0oH8mULVnA9IVXRROSX2gBaaHy/rYuhLgx5JPEy/RDl\n/mLfTd3RUvh2bkOQoU7ZTWtBctNCfMbse2ICfVyQlHR58VcMDu1KQjjxAoGBAIcB\nonGtRgrs3PMIg3iI4uMm5RhibAqSFuzKuGfGG+TQmltE0E1aKEF87C6wElP33o/y\n9bedqWJK/eQSK7wYI57JuM2dlujYJRoXNqDGeXAcf/DaqWMiHOFnEByiimhz9k8v\nwY1zZ175VBba4b0lxFntcCcIKo5J16JNmkDA5EyNAoGAO8pNsM0dg5ex0pTZ/sSG\nfSSeD5v92119LVGsLygmp4UC3+xqNYPRBSW57wKnz7iBs4xDpMMRXgzAuh97kEul\np1PlNUyqKVFoZL1ZnBu4mHWQUadAcXaOC6ajlabjr5CZ2VTg1zrX13HMhrXWX1VG\nKzGqOPigBmBSIm+qYcqS7sU=\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-fbsvc@turtlehub-d81a9.iam.gserviceaccount.com",
}


try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin Initialized');
} catch (error) {
  console.error('Firebase Admin Initialization Failed', error);
}

export const firebaseAdmin = admin;
