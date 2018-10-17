import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

let config = {
	apiKey: 'AIzaSyDXxoOsMwhcTs0RLx9yQxGFFZRYs6iDvLA',
	authDomain: 'ilandlord-486c3.firebaseapp.com',
	databaseURL: 'https://ilandlord-486c3.firebaseio.com',
	projectId: 'ilandlord-486c3',
	storageBucket: 'ilandlord-486c3.appspot.com',
	messagingSenderId: '828019508263'
}
firebase.initializeApp(config)
