'use server';

import {
  getPushAlarmMessage,
  PushAlarmData,
  PushAlarmType,
} from '@/features/alarm/setting/lib/getPushAlarmMessage';
import { createServerClient } from '@supabase/ssr';
import { supabase } from '@/shared/lib/supabaseClient';
import { cookies } from 'next/headers';
import webpush from 'web-push';

interface PushSubscriptionSerialized {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscription: PushSubscription | null = null;
const parsed = JSON.parse(JSON.stringify(subscription));

export async function subscribeUser(subscription: PushSubscriptionSerialized) {
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  if (!subscription) return;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error('유저 정보 조회 실패 : ', userError);
    return;
  }

  const { error } = await supabase.from('user_push_token').upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.error('푸시토큰 저장 실패 : ', error);
    return;
  }

  console.log('푸시토큰 생성완료');

  return { success: true, message: '푸시 토큰이 생성되었습니다.' };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(
  user_id: string,
  type: PushAlarmType,
  subType: string,
  data: PushAlarmData,
  options?: { allowWithoutToken?: boolean }
) {
  webpush.setVapidDetails(
    'mailto:haruyam15@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const { data: pushToken, error } = await supabase
    .from('user_push_token')
    .select('*')
    .eq('user_id', user_id);

  const hasValidToken = !error && pushToken && pushToken.length > 0;

  const customMessage = getPushAlarmMessage(type, subType, data);

  if (hasValidToken) {
    for (const token of pushToken) {
      const subscription = {
        endpoint: token.endpoint,
        keys: {
          p256dh: token.p256dh,
          auth: token.auth,
        },
      };

      const pushMessage = {
        title: customMessage.title,
        body: customMessage.body,
        image: customMessage.image ?? '',
        time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        url: customMessage.link,
      };

      const payloadData = JSON.stringify(pushMessage);

      try {
        await webpush.sendNotification(subscription, payloadData);
      } catch (err: any) {
        console.error('알림 전송 실패:', err);
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('user_push_token').delete().eq('endpoint', subscription.endpoint);
        }
      }
    }
  }

  const pushMessage = {
    title: customMessage.title,
    body: customMessage.body,
    image: customMessage.image ?? '',
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    url: customMessage.link,
  };

  const { error: insertError } = await supabase.from('alarm').insert({
    user_id: user_id,
    type: type,
    title: pushMessage.title,
    body: pushMessage.body,
    link: pushMessage.url,
    image_url: pushMessage.image,
  });

  if (insertError) {
    return { success: false, error: 'Alarm DB 추가 실패' };
  }

  return { success: true };
}
