import firebase from 'firebase'

const fetchFirestoreGetAll = async (type, propertyId, idName) => {
  let data,
    id = {},
    output = []

  data = await firebase.firestore().collection(type).where("propertyId", "==", propertyId).get()

  data.forEach(function(doc) {
    id[idName] = doc.id
    let newItem = Object.assign({}, id, doc.data())
    output.push(newItem)
  })

  return output

}

export default fetchFirestoreGetAll
