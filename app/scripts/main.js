/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BIFf2em_YAkmRDUF9KM6LVOD77bDMm_-JBEOl6Yei2UjmsNM9XkOBViVVdxWw8evM_aQGPlxCLnB-dRSW5TNugE';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
//Check if service work and push notifications are supported
if('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push are supported');
  navigator.serviceWorker.register('sw.js')
  .then(swReg => {
    console.log('serviceWorker is registred', swReg);
    swRegistration = swReg;
    initializeUI();
  })
  .catch(err => {
    console.log('serviceWorker error', err);
  });
}
else {
  console.warn('Push messaging is not supported!');
  pushButton.textContent = 'Push not supported!';

}
//UpdateBTn
const updateBtn = () => {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  if(isSubscribed) {
    pushButton.textContent = 'Disable Push messaging';
  } else {
    pushButton.textContent = 'Enable Push messaging';
  }
  pushButton.disabled = false;
}
//Check if the user is currently subscribed
const initializeUI = () => {
  pushButton.addEventListener('click', e => {
    pushButton.disabled = true;//disable it again, after subscribing
    if(isSubscribed) {
        alert('wait..')
        unsubscribeUser();
    } else {
        subscribeUser();
    }
  });
  //set the initial subscribption value
  swRegistration.pushManager.getSubscription()
  .then(subscription => {
    isSubscribed = !(subscription === null);
    if(isSubscribed) {
      console.log('User is subscribed!');
    }
    else {
      console.log('User is NOT subscribed');
    }
    updateBtn();
  })
  .catch(err =>{

  });
}
//if user is currently not subscribed
const subscribeUser = () => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(error) {
    console.error('Failed to subscribe the user: ', error);
    updateBtn();
  });
}

const updateSubscriptionOnServer = () => {
    // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}
const unsubscribeUser = () => {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}