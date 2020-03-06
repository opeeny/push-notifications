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

/* eslint-env browser, serviceworker, es6 */

'use strict';
//self means the serviceWorker itself
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.!');
    const title = 'Push Codelab';
    const options = {
        body: 'Yah it works',
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };
    event.waitUntil(self.ServiceWorkerRegistration.showNotification(title, options));
});
//notificationclick istener
self.addEventListener('notificationclick', (e) => {
    console.log('[Service Worker] Notification click received.');
    e.notification.close();
    //waitUntil ensures browser doesn't terminate the service worker until new tab to open the link is started
    e.waitUntil(
        clients.openWindow('https://opeeny.github.io')
    );
});