import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { axiosInstance } from './axios';

export const fetchGBChats = (userID, callBack) => {
  const q = query(
    collection(db, 'chat'),
    where('users', 'array-contains', `${userID}`),
    orderBy('lastMessageTime', 'desc')
  );

  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const changedChatsPromises = querySnapshot.docs.map(async (doc) => {
      const chatId = doc.id;

      const messagesRef = collection(db, 'chat', chatId, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('read', '==', false),
        where('receiverUid', '==', `${userID}`)
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      const messagesUnsubscribe = onSnapshot(
        messagesQuery,
        (messagesSnapshot) => {
          const unreadMessagesCount = messagesSnapshot.docs.length;
          const updatedChats = changedChats.map((changedChat) => {
            if (changedChat.chatId === chatId) {
              return {
                ...changedChat,
                unreadMessagesCount,
              };
            }
            return changedChat;
          });

          callBack(updatedChats);
        }
      );

      return {
        chatId,
        data: doc.data(),
        unreadMessagesCount: messagesSnapshot.size,
        messagesUnsubscribe,
      };
    });

    const changedChats = await Promise.all(changedChatsPromises);

    callBack(changedChats);
  });

  return unsubscribe;
};

export const lastMessageReadUpdate = (chatID, senderData) => {
  const userDocRef = doc(db, 'chat', `${chatID}`);
  const unsubscribe = onSnapshot(userDocRef, (userDocSnapshot) => {
    if (userDocSnapshot.exists()) {
      const lastMessageSender = userDocSnapshot.data()?.lastMessageSender;

      if (lastMessageSender !== `${senderData?.id}`) {
        const updatedUserData = { lastMessageRead: true };
        updateDoc(userDocRef, updatedUserData);
      }
    }
  });

  return unsubscribe;
};

export const fetchChatMessages = (chatID, senderData, callBack) => {
  let unsubscribe;

  const fetchMessages = () => {
    const chatRef = doc(db, 'chat', `${chatID}`);
    getDoc(chatRef)
      .then((chatDoc) => {
        if (!chatDoc.exists()) {
          callBack({ success: false });
          return;
        }

        const messagesRef = collection(db, 'chat', `${chatID}`, 'messages');
        const queryMessages = query(messagesRef, orderBy('time'));

        unsubscribe = onSnapshot(queryMessages, (querySnapshot) => {
          const docIds = querySnapshot.docs?.map((doc) => ({
            id: doc.id,
            data: doc.data() || {},
          }));

          callBack({ success: true, data: docIds });

          querySnapshot.forEach((chat) => {
            const docData = chat.data();
            if (docData.receiverUid === `${senderData?.id}` && !docData.read) {
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
        });
      })
      .catch((error) => {
        callBack({ success: false, error: error.message });
      });
  };

  if (chatID) {
    fetchMessages();
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

export const gbChatNewMessage = (userID, callBack) => {
  const q = query(
    collection(db, 'chat'),
    where('users', 'array-contains', `${userID}`)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let totalUnreadMessages = 0;

    querySnapshot.forEach((docSnap) => {
      const messagesRef = collection(docSnap.ref, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('read', '==', false),
        where('receiverUid', '==', `${userID}`)
      );

      onSnapshot(messagesQuery, (messagesSnapshot) => {
        const unreadMessages = messagesSnapshot.docs.length;
        totalUnreadMessages = unreadMessages;

        callBack(totalUnreadMessages);
      });
    });
  });

  return unsubscribe;
};

export const createGBChat = async (
  chatID,
  receiverData,
  senderData,
  chatIDCheck
) => {
  const userDocRefCheck = doc(db, 'chat', `${chatID || chatIDCheck}`);
  const userDocRefSet = doc(db, 'chat', `${chatID}`);
  const userDocSnapshot = await getDoc(userDocRefCheck);

  if (!userDocSnapshot.exists()) {
    const chatDocData = {
      buyerChat: receiverData?.user_type === 'buyer' ? true : false,
      lastMessage: 'Чат создан',
      lastMessageRead: false,
      lastMessageReceiverAvatar: receiverData?.avatar || '',
      lastMessageReceiverName: receiverData?.fullname || '',
      lastMessageSender: `${senderData?.id}` || '',
      lastMessageSenderAvatar: senderData?.avatar || '',
      lastMessageSenderName: senderData?.fullname || '',
      lastMessageTime: serverTimestamp(),
      uid: `${chatID}` || '',
      users: [`${senderData?.id}`, `${receiverData?.id}` || ''],
    };
    if (receiverData?.user_type === 'client') {
      chatDocData.lastMessageReceiver = `${receiverData?.id}`;
    }
    await setDoc(userDocRefSet, chatDocData);

    const createdChatDoc = await getDoc(userDocRefSet);

    return { success: true, data: createdChatDoc.data() };
  }
  return { success: true, data: 'Document already exists' };
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

export const sendGBChatImage = async (senderData, chatData, file) => {
  if (!file) {
    return false;
  }
  const milliseconds = new Date().getMilliseconds();
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', milliseconds);

  try {
    const res = await axiosInstance.post('core/image/', formData);
    const imgLink = res?.data?.image;
    if (imgLink) {
      const userDocRef = doc(db, 'chat', `${chatData?.uid}`);

      const receiverID = chatData?.users?.filter(
        (id) => id !== `${senderData?.id}`
      );

      await addDoc(collection(userDocRef, 'messages'), {
        text: '',
        image: imgLink,
        time: serverTimestamp(),
        read: false,
        receiverUid: receiverID[0],
        senderUid: `${senderData?.id}`,
      });

      const messageRef = doc(db, 'chat', `${chatData?.uid}`);

      await updateDoc(messageRef, {
        lastMessage: 'файл',
        lastMessageRead: false,
        lastMessageSender: `${senderData?.id}`,
        lastMessageTime: serverTimestamp(),
      });
    }
  } catch (error) {
    ('');
  }
};
