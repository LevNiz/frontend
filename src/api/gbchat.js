import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const fetchGBChats = (userID, callBack) => {
  const q = query(
    collection(db, 'chat'),
    where('users', 'array-contains', `${userID}`),
    orderBy('lastMessageTime', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const changedChats = querySnapshot.docs
      .filter((doc) => doc.data().users.includes(`${userID}`))
      .map((doc) => ({
        chatId: doc.id,
        data: doc.data(),
      }));

    callBack(changedChats);
  });

  return unsubscribe;
};

export const fetchChatMessages = async (
  chatID,
  senderData,
  receiver,
  callback
) => {
  const userDocRef = doc(db, 'chat', `${chatID}`);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const q = query(
      collection(db, 'chat', `${chatID}`, 'messages'),
      orderBy('time')
    );
    const querySnap = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((chat) => {
        const docData = chat.data();
        if (docData.receiverUid == `${senderData?.id}` && !docData.read) {
          const messageRef = doc(
            db,
            'chat',
            `${chatID}`,
            'messages',
            `${chat.id}`
          );

          updateDoc(messageRef, { read: true });
        }
      });

      const docData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() || {},
      }));

      callback(docData);
    });
    return () => {
      querySnap();
    };
  } else if (receiver !== null) {
    await setDoc(userDocRef, {
      buyer: true,
      lastMessage: 'Чат создан',
      lastMessageRead: false,
      lastMessageReceiverAvatar: receiver?.avatar,
      lastMessageReceiverName: receiver?.fullname,
      lastMessageSender: `${senderData?.id}`,
      lastMessageSenderAvatar: senderData?.avatar,
      lastMessageSenderName: senderData?.fullname,
      lastMessageTime: serverTimestamp(),
      uid: `${chatID}`,
      users: [`${senderData?.id}`, `${receiver?.id}`],
    });
  }
};

export const sendMessage = async (e, inputVal, senderData, chatData) => {
  e.preventDefault();

  const trimmedInput = inputVal.trim();
  if (trimmedInput === '') {
    return;
  }

  const userDocRef = doc(db, 'chat', `${chatData?.uid}`);

  const receiverID = chatData?.users?.filter(
    (id) => id !== `${senderData?.id}`
  );

  await addDoc(collection(userDocRef, 'messages'), {
    text: trimmedInput,
    image: '',
    time: serverTimestamp(),
    read: false,
    receiverUid: receiverID[0],
    senderUid: `${senderData?.id}`,
  });

  const messageRef = doc(db, 'chat', `${chatData?.uid}`);

  await updateDoc(messageRef, {
    lastMessage: trimmedInput,
    lastMessageRead: false,
    lastMessageSender: `${senderData?.id}`,
    lastMessageTime: serverTimestamp(),
  });
};
