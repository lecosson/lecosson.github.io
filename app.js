/**
 * Created by alexander.polyakov on 06.04.2018.
 */

$(document).ready(function(){


    // firebase_subscribe.js
    firebase.initializeApp({
        messagingSenderId: '490539703531'
    });

        // браузер поддерживает уведомления
    // вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
    if ('Notification' in window) {
        var messaging = firebase.messaging();

        // пользователь уже разрешил получение уведомлений
        // подписываем на уведомления если ещё не подписали
        if (Notification.permission === 'granted') {
            subscribe();
        }

        // по клику, запрашиваем у пользователя разрешение на уведомления
        // и подписываем его
        $('#subscribe').on('click', function () {
            subscribe();
        });
    }

    function subscribe() {
        // запрашиваем разрешение на получение уведомлений
        messaging.requestPermission()
            .then(function () {
                // получаем ID устройства
                messaging.getToken()
                    .then(function (currentToken) {
                        console.log(currentToken);

                        if (currentToken) {
                            sendTokenToServer(currentToken);
                        } else {
                            console.warn('Не удалось получить токен.');
                            setTokenSentToServer(false);
                        }
                    })
                    .catch(function (err) {
                        console.warn('При получении токена произошла ошибка.', err);
                        setTokenSentToServer(false);
                    });
            })
            .catch(function (err) {
                console.warn('Не удалось получить разрешение на показ уведомлений.', err);
            });
        // messaging.onTokenRefresh(function() {
        //     messaging.getToken().then(function(refreshedToken) {
        //         console.log('Token refreshed.');
        //         // Indicate that the new Instance ID token has not yet been sent to the
        //         // app server.
        //         setTokenSentToServer(false);
        //         // Send Instance ID token to app server.
        //         sendTokenToServer(refreshedToken);
        //         // ...
        //     }).catch(function(err) {
        //         console.log('Unable to retrieve refreshed token ', err);
        //         showToken('Unable to retrieve refreshed token ', err);
        //     });
        // });
    }

    // отправка ID на сервер
    function sendTokenToServer(currentToken) {
        if (!isTokenSentToServer(currentToken)) {
            console.log('Отправка токена на сервер...');

            var url = '/senddeviceid'; // адрес скрипта на сервере который сохраняет ID устройства
            $.post(url, {
                token: currentToken
            });

            setTokenSentToServer(currentToken);
        } else {
            console.log('Токен уже отправлен на сервер.');
        }
    }

    // используем localStorage для отметки того,
    // что пользователь уже подписался на уведомления
    function isTokenSentToServer(currentToken) {
        return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
    }

    function setTokenSentToServer(currentToken) {
        window.localStorage.setItem(
            'sentFirebaseMessagingToken',
            currentToken ? currentToken : ''
        );
    }

});